export const config = {
	port: Number(process.env.PORT) || 3001,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret_here',
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_here',
	databaseUrl: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/voxelheim_auth',
	accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
	refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
	passwordHashCost: 10
}
