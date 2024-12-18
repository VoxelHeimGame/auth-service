import { t } from 'elysia'

export const authValidator = {
	registerSchema: t.Object({
		username: t.String({ minLength: 3, maxLength: 30 }),
		email: t.String({ format: 'email' }),
		password: t.String({ minLength: 8 }),
		fullname: t.String({ minLength: 2 })
	}),
	loginSchema: t.Object({
		username: t.String(),
		password: t.String()
	})
}
