import { Elysia, t } from 'elysia'
import { AuthService } from '../services/auth-service'
import { authValidator } from '../validators/auth-validator'
import { authMiddleware } from '../middleware/auth-middleware'

export const authRoutes = new Elysia()
	.derive(({ accessJwt, refreshJwt }) => {
		return {
			authService: new AuthService(accessJwt, refreshJwt)
		}
	})
	.post(
		'/auth/register',
		async ({ body, authService }) => {
			return await authService.register(body)
		},
		{
			body: authValidator.registerSchema,
			detail: {
				summary: 'Register a new user',
				tags: ['Auth']
			}
		}
	)
	.post(
		'/auth/login',
		async ({ body, authService }) => {
			return await authService.login(body)
		},
		{
			body: authValidator.loginSchema,
			detail: {
				summary: 'User login',
				tags: ['Auth']
			}
		}
	)
	.post(
		'/auth/refresh-token',
		async ({ body, authService }) => {
			return await authService.refreshToken(body.refreshToken)
		},
		{
			body: t.Object({ refreshToken: t.String() }),
			detail: {
				summary: 'Refresh access token',
				tags: ['Auth']
			}
		}
	)
	.post(
		'/auth/logout',
		async ({ body, authService, payload }) => {
			await authService.logout(body.refreshToken, payload.userId)
			return { message: 'Logout successful' }
		},
		{
			beforeHandle: authMiddleware,
			body: t.Object({ refreshToken: t.String() }),
			detail: {
				summary: 'User logout',
				tags: ['Auth']
			}
		}
	)
