import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import { userSchema } from '../validations/userValidations'
import { errorResponseSchema } from '../validations/authValidations'
import { CONFIG } from '../config'

type Variables = JwtVariables

const userRoutes = new Hono<{ Variables: Variables }>()

const jwtMiddleware = jwt({
	secret: CONFIG.JWT_ACCESS_SECRET
})

userRoutes.get(
	'/me',
	jwtMiddleware,
	describeRoute({
		description: "Retrieve the current authenticated user's information",
		tags: ['Users'],
		security: [{ bearerAuth: [] }],
		responses: {
			200: {
				description: 'User information retrieved successfully',
				content: {
					'application/json': {
						schema: resolver(userSchema)
					}
				}
			},
			401: {
				description: 'Unauthorized',
				content: {
					'application/json': {
						schema: resolver(errorResponseSchema)
					}
				}
			}
		}
	}),
	async (c) => {
		const payload = c.get('jwtPayload')
		const user = {
			id: payload.sub,
			username: 'testuser',
			email: 'test@example.com',
			createdAt: new Date().toISOString()
		}
		return c.json(user)
	}
)

export { userRoutes }
