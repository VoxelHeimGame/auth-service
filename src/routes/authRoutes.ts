import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { describeRoute } from 'hono-openapi'
import { resolver, validator as zValidator } from 'hono-openapi/zod'
import { CONFIG } from '../config'
import { loginSchema, registerSchema, tokenResponseSchema, errorResponseSchema, refreshTokenSchema } from '../validations/authValidations'

const authRoutes = new Hono()

// Login route with OpenAPI documentation
authRoutes.post(
	'/login',
	describeRoute({
		description: 'Authenticate user and receive JWT tokens',
		tags: ['Authentication'],
		responses: {
			200: {
				description: 'Login successful',
				content: {
					'application/json': {
						schema: resolver(tokenResponseSchema)
					}
				}
			},
			401: {
				description: 'Invalid credentials',
				content: {
					'application/json': {
						schema: resolver(errorResponseSchema)
					}
				}
			}
		}
	}),
	zValidator('json', loginSchema),
	async (c) => {
		const { username, password } = c.req.valid('json')

		// Simulate user lookup
		if (username === 'test' && password === 'test123') {
			const accessToken = await sign({ userId: '1', type: 'access' }, CONFIG.JWT_ACCESS_SECRET)
			const refreshToken = await sign({ userId: '1', type: 'refresh' }, CONFIG.JWT_REFRESH_SECRET)
			return c.json({ accessToken, refreshToken })
		}

		return c.json({ error: 'Invalid credentials' }, 401)
	}
)

// Register route with OpenAPI documentation
authRoutes.post(
	'/register',
	describeRoute({
		description: 'Register a new user account',
		tags: ['Authentication'],
		responses: {
			201: {
				description: 'Registration successful',
				content: {
					'application/json': {
						schema: resolver(errorResponseSchema)
					}
				}
			},
			400: {
				description: 'Registration failed',
				content: {
					'application/json': {
						schema: resolver(errorResponseSchema)
					}
				}
			}
		}
	}),
	zValidator('json', registerSchema),
	async (c) => {
		const _data = c.req.valid('json')
		// Simulate user creation
		return c.json({ message: 'User registered successfully' }, 201)
	}
)

// Refresh token route
authRoutes.post(
	'/refresh',
	describeRoute({
		description: 'Refresh access token using a valid refresh token',
		tags: ['Authentication'],
		responses: {
			200: {
				description: 'New access token generated successfully',
				content: {
					'application/json': {
						schema: resolver(tokenResponseSchema)
					}
				}
			},
			401: {
				description: 'Invalid or expired refresh token',
				content: {
					'application/json': {
						schema: resolver(errorResponseSchema)
					}
				}
			}
		}
	}),
	zValidator('json', refreshTokenSchema),
	async (c) => {
		const { refreshToken } = c.req.valid('json')

		try {
			const payload = await verify(refreshToken, CONFIG.JWT_REFRESH_SECRET)

			if (payload.type !== 'refresh') {
				return c.json({ error: 'Invalid token type' }, 401)
			}

			const newAccessToken = await sign({ userId: payload.userId, type: 'access' }, CONFIG.JWT_ACCESS_SECRET)

			return c.json({ accessToken: newAccessToken })
		} catch (_error) {
			return c.json({ error: 'Invalid or expired refresh token' }, 401)
		}
	}
)

export { authRoutes }
