import { z } from 'zod'
import 'zod-openapi/extend'

export const loginSchema = z
	.object({
		username: z.string().min(3).describe('Username for login'),
		password: z.string().min(6).describe('User password')
	})
	.openapi({ ref: 'LoginInput' })

export const registerSchema = z
	.object({
		username: z.string().min(3).max(20).describe('Desired username'),
		password: z.string().min(6).describe('Password must be at least 6 characters'),
		email: z.string().email().describe('Valid email address')
	})
	.openapi({ ref: 'RegisterInput' })

export const tokenResponseSchema = z
	.object({
		accessToken: z.string(),
		refreshToken: z.string()
	})
	.openapi({ ref: 'TokenResponse' })

export const errorResponseSchema = z
	.object({
		error: z.string()
	})
	.openapi({ ref: 'ErrorResponse' })

export const refreshTokenSchema = z
	.object({
		refreshToken: z.string().describe('Refresh token for obtaining a new access token')
	})
	.openapi({ ref: 'RefreshTokenInput' })
