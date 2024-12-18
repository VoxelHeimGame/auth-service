import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { jwt } from '@elysiajs/jwt'
import { cron } from '@elysiajs/cron'
import { config } from './config'
import { db } from './db'
import { authRoutes } from './api/auth'
import { userRoutes } from './api/user'

const app = new Elysia()
	.use(
		swagger({
			documentation: {
				info: {
					title: 'VoxelHeim Auth Service API',
					version: '1.0.0',
					description: 'Authentication and user management API for the VoxelHeim MMORPG'
				},
				tags: [
					{ name: 'Auth', description: 'Authentication endpoints' },
					{ name: 'User', description: 'User management endpoints' }
				]
			}
		})
	)
	.use(
		jwt({
			name: 'accessJwt',
			secret: config.accessTokenSecret,
			exp: config.accessTokenExpiration
		})
	)
	.use(
		jwt({
			name: 'refreshJwt',
			secret: config.refreshTokenSecret,
			exp: config.refreshTokenExpiration
		})
	)
	.use(
		cron({
			name: 'clean-expired-tokens',
			pattern: '0 0 * * *', // Run every day at midnight
			async run() {
				await db.query('DELETE FROM refresh_tokens WHERE expires_at <= NOW()')
				console.log('Expired tokens cleaned')
			}
		})
	)
	.decorate('db', db)
	.use(authRoutes)
	.use(userRoutes)
	.get('/', () => 'VoxelHeim Auth Service')
	.get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
	.listen(config.port)

console.log(`🔒 Auth Service is running at ${app.server?.hostname}:${app.server?.port}`)
