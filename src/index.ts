import { Elysia } from 'elysia'

const app = new Elysia().get('/', () => 'Auth Service is running').listen(3001)

console.log(`🔒 Auth Service is running at ${app.server?.hostname}:${app.server?.port}`)
