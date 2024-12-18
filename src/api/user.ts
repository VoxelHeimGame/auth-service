import { Elysia } from 'elysia'
import { UserService } from '../services/user-service'
import { authMiddleware } from '../middleware/auth-middleware'

export const userRoutes = new Elysia().get(
	'/users/me',
	async ({ payload }) => {
		const userService = new UserService()
		const user = await userService.getUserById(payload.userId)
		if (!user) {
			throw new Error('User not found')
		}
		return user
	},
	{
		beforeHandle: authMiddleware,
		detail: {
			summary: 'Get current user information',
			tags: ['User']
		}
	}
)
