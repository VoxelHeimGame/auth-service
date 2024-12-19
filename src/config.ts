// Ensure that NODE_ENV is set
if (!process.env.NODE_ENV) {
	console.warn('NODE_ENV not set. Defaulting to development.')
	process.env.NODE_ENV = 'development'
}

const requiredEnvVars = [
	'AUTH_DB_URL',
	'PORT',
	'ACCESS_TOKEN_EXPIRES_IN',
	'REFRESH_TOKEN_EXPIRES_IN',
	'JWT_ACCESS_SECRET',
	'JWT_REFRESH_SECRET'
]

// Validate required environment variables
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`)
	}
}

export const CONFIG = {
	NODE_ENV: process.env.NODE_ENV as string,
	AUTH_DB_URL: process.env.AUTH_DB_URL as string,
	PORT: Number.parseInt(process.env.PORT as string, 10),
	ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
	REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string
}

// Type assertion to ensure all config values are defined
const assertConfig: Record<keyof typeof CONFIG, string | number> = CONFIG

// Validate that all config values are defined and of the correct type
Object.entries(assertConfig).forEach(([key, value]) => {
	if (value === undefined) {
		throw new Error(`Configuration value for ${key} is undefined`)
	}
	if (key === 'PORT' && typeof value !== 'number') {
		throw new Error(`Configuration value for ${key} is not a number`)
	}
	if (key !== 'PORT' && typeof value !== 'string') {
		throw new Error(`Configuration value for ${key} is not a string`)
	}
})
