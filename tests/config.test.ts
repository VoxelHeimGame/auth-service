import { describe, expect, it } from 'bun:test'
import { CONFIG } from '../src/config'

describe('Environment Configuration', () => {
	it('should have all required environment variables', () => {
		expect(CONFIG.NODE_ENV).toBe('test')
		expect(CONFIG.AUTH_DB_URL).toBe('mongodb://localhost:27017/voxelheim_test')
		expect(CONFIG.PORT).toBe(5000)
		expect(CONFIG.ACCESS_TOKEN_EXPIRES_IN).toBe('5m')
		expect(CONFIG.REFRESH_TOKEN_EXPIRES_IN).toBe('1d')
		expect(CONFIG.JWT_ACCESS_SECRET).toBe('test_access_secret')
		expect(CONFIG.JWT_REFRESH_SECRET).toBe('test_refresh_secret')
	})

	it('should have correct types for all configuration values', () => {
		expect(typeof CONFIG.NODE_ENV).toBe('string')
		expect(typeof CONFIG.AUTH_DB_URL).toBe('string')
		expect(typeof CONFIG.PORT).toBe('number')
		expect(typeof CONFIG.ACCESS_TOKEN_EXPIRES_IN).toBe('string')
		expect(typeof CONFIG.REFRESH_TOKEN_EXPIRES_IN).toBe('string')
		expect(typeof CONFIG.JWT_ACCESS_SECRET).toBe('string')
		expect(typeof CONFIG.JWT_REFRESH_SECRET).toBe('string')
	})
})
