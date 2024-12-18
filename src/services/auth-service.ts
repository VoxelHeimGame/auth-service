import type { JWTPayloadSpec } from '@elysiajs/jwt'
import { AuthError } from '../exceptions/auth-error'
import { config } from '../config'
import { db } from '../db'
import { parseExpiration } from '../utils/time'

interface JwtInstance {
	sign: (payload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>
	verify: (jwt?: string) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>
}

export class AuthService {
	constructor(
		private accessJwt: JwtInstance,
		private refreshJwt: JwtInstance
	) {}

	async register(userData: { username: string; email: string; password: string; fullname: string }) {
		const { username, email, password, fullname } = userData

		// Check if user already exists
		const existingUser = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])
		if (existingUser.rows.length > 0) {
			throw new AuthError('Username or email already exists')
		}

		// Hash password
		const hashedPassword = await Bun.password.hash(password, {
			algorithm: 'bcrypt',
			cost: config.passwordHashCost
		})

		// Insert new user
		const result = await db.query(
			'INSERT INTO users (username, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, name',
			[username, email, hashedPassword, fullname]
		)

		const user = result.rows[0]
		const accessToken = await this.accessJwt.sign({ userId: user.id, type: 'access' })
		const refreshToken = await this.refreshJwt.sign({ userId: user.id, type: 'refresh' })

		// Store refresh token
		await db.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [
			user.id,
			refreshToken,
			new Date(Date.now() + parseExpiration(config.refreshTokenExpiration))
		])

		return { user, accessToken, refreshToken }
	}

	async login(credentials: { username: string; password: string }) {
		const { username, password } = credentials

		const result = await db.query('SELECT * FROM users WHERE username = $1', [username])
		if (result.rows.length === 0) {
			throw new AuthError('Invalid credentials')
		}

		const user = result.rows[0]
		const isValidPassword = await Bun.password.verify(password, user.password_hash)
		if (!isValidPassword) {
			throw new AuthError('Invalid credentials')
		}

		const accessToken = await this.accessJwt.sign({ userId: user.id, type: 'access' })
		const refreshToken = await this.refreshJwt.sign({ userId: user.id, type: 'refresh' })

		// Store refresh token
		await db.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [
			user.id,
			refreshToken,
			new Date(Date.now() + parseExpiration(config.refreshTokenExpiration))
		])

		return { user: { id: user.id, username: user.username, email: user.email, name: user.name }, accessToken, refreshToken }
	}

	async refreshToken(refreshToken: string) {
		const payload = await this.refreshJwt.verify(refreshToken)
		if (!payload || typeof payload === 'boolean' || !payload.userId || payload.type !== 'refresh') {
			throw new AuthError('Invalid refresh token')
		}

		const result = await db.query('SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()', [refreshToken])
		if (result.rows.length === 0) {
			throw new AuthError('Refresh token expired or not found')
		}

		const newAccessToken = await this.accessJwt.sign({ userId: payload.userId, type: 'access' })
		return { accessToken: newAccessToken }
	}

	async logout(refreshToken: string) {
		await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken])
	}
}
