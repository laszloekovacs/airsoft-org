import { betterAuth } from 'better-auth'
import db from './db.server'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '~/schema/auth-schema'

export const authServer = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			...schema
		}
	}),
	emailAndPassword: {
		enabled: true
	},
	user: {
		additionalFields: {
			claims: {
				type: 'string[]',
				input: false,
				returned: true,
			}
		}
	},
	trustedOrigins: [process.env.BASE_URL!]
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

export const AuthorizedOnly = async (
	request: Request,
	claimsRequired: string[]
) => {
	const sessionCookieData = await authServer.api.getSession(request)

	// throw if user not logged in
	if (sessionCookieData == null) {
		throw new Response('Unauthorized', { status: 401 })
	}

	// throw error if no claim is set
	if (claimsRequired.length == 0) {
		throw new Response('Claims required for resource, but none set', {
			status: 401
		})
	}

	// get claims from users session data
	// check if session data claims include required claims
	// throw if user has no claim to resource
	// return user data if authorized, and the list of claims

	return { ...sessionCookieData, claimsRequired }
}
