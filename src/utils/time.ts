export const parseExpiration = (exp: string): number => {
	const unit = exp.slice(-1)
	const value = Number.parseInt(exp.slice(0, -1))
	switch (unit) {
		case 'm':
			return value * 60 * 1000
		case 'h':
			return value * 60 * 60 * 1000
		case 'd':
			return value * 24 * 60 * 60 * 1000
		default:
			return value * 1000 // Assume seconds if no unit specified
	}
}
