export const getExpTimestamp = (seconds: number) => {
	return Math.floor(Date.now() / 1000) + seconds
}

export const hashPassword = async (password: string) => {
	return Bun.password.hash(password, {
		algorithm: 'bcrypt',
		cost: 10
	})
}

export const verifyPassword = async (password: string, hash: string) => {
	return Bun.password.verify(password, hash, 'bcrypt')
}
