import { Pool } from 'pg'
import { config } from './config'

export const db = new Pool({
	connectionString: config.databaseUrl
})

db.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})
