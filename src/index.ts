import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { authRoutes } from './routes/authRoutes'
import { userRoutes } from './routes/userRoutes'
import { openAPISpecs } from 'hono-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { CONFIG } from './config'

// Extend Zod with OpenAPI
import 'zod-openapi/extend'

const app = new Hono()

// Middlewares
app.use('*', prettyJSON())
app.use('*', logger())
app.use('*', cors())
app.use('*', secureHeaders())

// Routes
app.route('/', authRoutes)
app.route('/users', userRoutes)

app.get('/', (c) => c.text(`VoxelHeim Auth Server (${CONFIG.NODE_ENV})`))

// OpenAPI documentation
app.get(
	'/openapi',
	openAPISpecs(app, {
		documentation: {
			info: {
				title: 'VoxelHeim Auth API',
				version: '1.0.0',
				description: 'API for VoxelHeim MMORPG authentication and user management'
			},
			servers: [{ url: `http://localhost:${CONFIG.PORT}`, description: 'Local Server' }],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					}
				}
			},
			security: [{ bearerAuth: [] }]
		}
	})
)

// Scalar API Reference UI
app.get(
	'/docs',
	apiReference({
		spec: {
			url: '/openapi'
		},
		theme: 'default'
	})
)

const port = CONFIG.PORT
console.log(`API Documentation available at: http://localhost:${port}/docs`)

export default {
	port,
	fetch: app.fetch
}
