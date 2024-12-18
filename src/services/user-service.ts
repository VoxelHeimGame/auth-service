import { db } from '../db'

export class UserService {
	async getUserById(userId: string | number) {
		const result = await db.query('SELECT id, username, email, name FROM users WHERE id = $1', [userId])

		if (result.rows.length === 0) {
			return null
		}

		return result.rows[0]
	}
}
