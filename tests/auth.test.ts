import { describe, expect, it } from 'bun:test'
import { Hono } from 'hono'
import { authRoutes } from '../src/routes/authRoutes'
import { verify } from 'hono/jwt'
import { CONFIG } from '../src/config'

// Define interfaces for our response bodies
interface TokenResponse {
	accessToken: string
	refreshToken: string
}

interface ErrorResponse {
	error: string
}

interface SuccessResponse {
	message: string
}

describe('Auth Routes', () => {
	const app = new Hono().route('/auth', authRoutes)

	it('should login successfully with correct credentials', async () => {
		const res = await app.request('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: 'test',
				password: 'test123'
			})
		})

		expect(res.status).toBe(200)
		const body = (await res.json()) as TokenResponse
		expect(body).toHaveProperty('accessToken')
		expect(body).toHaveProperty('refreshToken')

		// Verify access token
		const accessPayload = await verify(body.accessToken, CONFIG.JWT_ACCESS_SECRET)
		expect(accessPayload).toHaveProperty('userId', '1')
		expect(accessPayload).toHaveProperty('type', 'access')

		// Verify refresh token
		const refreshPayload = await verify(body.refreshToken, CONFIG.JWT_REFRESH_SECRET)
		expect(refreshPayload).toHaveProperty('userId', '1')
		expect(refreshPayload).toHaveProperty('type', 'refresh')
	})

	it('should fail login with incorrect credentials', async () => {
		const res = await app.request('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: 'test',
				password: 'wrongpassword'
			})
		})

		expect(res.status).toBe(401)
		const body = (await res.json()) as ErrorResponse
		expect(body).toEqual({ error: 'Invalid credentials' })
	})

	it('should register a new user successfully', async () => {
		const res = await app.request('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: 'newuser',
				password: 'password123',
				email: 'newuser@example.com'
			})
		})

		expect(res.status).toBe(201)
		const body = (await res.json()) as SuccessResponse
		expect(body).toEqual({ message: 'User registered successfully' })
	})

	it('should refresh access token with valid refresh token', async () => {
		// First, login to get a refresh token
		const loginRes = await app.request('/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: 'test', password: 'test123' })
		})
		const loginBody = (await loginRes.json()) as TokenResponse
		const { refreshToken } = loginBody

		// Now use the refresh token to get a new access token
		const refreshRes = await app.request('/auth/refresh', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken })
		})

		expect(refreshRes.status).toBe(200)
		const refreshBody = (await refreshRes.json()) as TokenResponse
		expect(refreshBody).toHaveProperty('accessToken')

		// Verify the new access token
		const accessPayload = await verify(refreshBody.accessToken, CONFIG.JWT_ACCESS_SECRET)
		expect(accessPayload).toHaveProperty('userId', '1')
		expect(accessPayload).toHaveProperty('type', 'access')
	})
})
