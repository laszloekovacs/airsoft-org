import { betterAuth } from "better-auth"
import database from "./db.server"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import * as schema from "~/schema/auth-schema"

const { BETTER_AUTH_URL } = process.env

if (typeof BETTER_AUTH_URL != "string") {
	throw new Error("BETTER_AUTH_URL undefined or not a string")
}

/**
 * create better auth instance
 */
export const authServer = betterAuth({
	database: drizzleAdapter(database, {
		provider: "pg",
		schema: {
			...schema,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			claims: {
				type: "string[]",
				input: false,
				returned: true,
			},
			callsign: {
				type: "string",
				input: true,
				returned: true,
			},
		},
	},
	trustedOrigins: [BETTER_AUTH_URL],
})

// required for better auth cli
export const auth = authServer

/**
 * Allow only logged in users to see page
 * @param request route request object from loader
 * @returns user, session data
 */
export const AuthenticatedOnly = async (request: Request) => {
	const sessionCookieData = await authServer.api.getSession(request)

	if (sessionCookieData == null) {
		throw new Response("Unauthorized", { status: 401 })
	}

	return { ...sessionCookieData }
}

/**
 * Allow olny users with required claims to see page
 * @param request request object from the loader
 * @param claimsRequired a list of strings that the user has to have in his claims array to proceed
 * @returns session, user, required claims array
 */
export const AuthorizedOnly = async (
	request: Request,
	claimsRequired: string[],
) => {
	const sessionCookieData = await AuthenticatedOnly(request)

	// throw error if no claim is set
	if (claimsRequired.length == 0) {
		throw new Response("Claims required for resource, but none set", {
			status: 401,
		})
	}

	const { claims } = sessionCookieData.user

	// check if users claims has all required claims
	const hasAllClaims = claimsRequired.every((claim) => claims.includes(claim))
	if (!hasAllClaims) {
		throw new Response("Forbidden: missing required claims", { status: 403 })
	}

	return { ...sessionCookieData, claimsRequired }
}
