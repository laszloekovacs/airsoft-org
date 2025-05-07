import { betterAuth } from 'better-auth'
import db from './db.server'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '~/db/auth-schema'

export const authServer = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			...schema
		}
	}),
	emailAndPassword: {
		enabled: true
	}
})

// required for better auth cli
export const auth = authServer

export const AuthenticatedOnly = async (request: Request) => {
	const sessionCookieData = await authServer.api.getSession(request)

	if (sessionCookieData == null) {
		throw new Response('Unauthorized', { status: 401 })
	} else {
		return { ...sessionCookieData }
	}
}
