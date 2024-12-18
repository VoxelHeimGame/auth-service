import type { Context } from 'elysia'
import { AuthError } from '../exceptions/auth-error'

export const authMiddleware = async ({ request, accessJwt, set }: Context) => {
	const authHeader = request.headers.get('Authorization')
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		set.status = 401
		throw new AuthError('Unauthorized')
	}

	const token = authHeader.split(' ')[1]
	const payload = await accessJwt.verify(token)
	if (!payload || typeof payload === 'boolean' || !payload.userId) {
		set.status = 401
		throw new AuthError('Invalid token')
	}

	return payload
}
