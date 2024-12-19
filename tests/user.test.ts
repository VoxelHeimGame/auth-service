import { describe, expect, it } from 'bun:test'
import { Hono } from 'hono'
import { userRoutes } from '../src/routes/userRoutes'
import { sign } from 'hono/jwt'
import { CONFIG } from '../src/config'

describe('User Routes', () => {
	const app = new Hono().route('/users', userRoutes)

	it('should get current user information', async () => {
		const token = await sign({ sub: '1' }, CONFIG.JWT_ACCESS_SECRET)
		const res = await app.request('/users/me', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		expect(res.status).toBe(200)
		const body = await res.json()
		expect(body).toHaveProperty('id')
		expect(body).toHaveProperty('username')
		expect(body).toHaveProperty('email')
		expect(body).toHaveProperty('createdAt')
	})

	it('should return 401 for unauthorized access to /me', async () => {
		const res = await app.request('/users/me', {
			method: 'GET'
		})

		expect(res.status).toBe(401)
	})
})
