import { betterAuth } from 'better-auth'
import db from './db.server'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '~/db/auth-schema'

export const authServer = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			...schema
		}
	}),
	emailAndPassword: {
		enabled: true
	}
})

export const AuthenticatedOnly = async (request: Request) => {
	const sessionCookieData = await authServer.api.getSession(request)

	if (sessionCookieData == null) {
		throw new Error('not authenticated')
	} else {
		return { ...sessionCookieData }
	}
}
