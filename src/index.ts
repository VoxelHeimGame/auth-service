import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Auth Service is running')
	.get('/health', () => ({ status: 'ok' }))
	.listen({
		hostname: '0.0.0.0',
		port: process.env.API_PORT ? Number.parseInt(process.env.API_PORT) : 3001,
		reusePort: true
	})

console.log(`🔒 Auth Service is running at ${app.server?.hostname}:${app.server?.port}`)
