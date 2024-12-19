import { z } from 'zod'
import 'zod-openapi/extend'

export const userSchema = z
	.object({
		id: z.string().describe('Unique user identifier'),
		username: z.string().describe("User's username"),
		email: z.string().email().describe("User's email address"),
		createdAt: z.string().datetime().describe('Account creation timestamp')
	})
	.openapi({ ref: 'User' })
