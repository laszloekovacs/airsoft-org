import { createAuthClient } from 'better-auth/react'

// TODO: Update the baseURL
export const authClient = createAuthClient({
	baseURL: import.meta.env.BASE_URL
})
