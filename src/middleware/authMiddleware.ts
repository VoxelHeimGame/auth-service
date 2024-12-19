import type { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'
import { CONFIG } from '../config'

export const authMiddleware = (c: Context, next: Next) => {
	return jwt({
		secret: CONFIG.JWT_ACCESS_SECRET
	})(c, next)
}
