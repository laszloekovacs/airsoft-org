import { createAuthClient } from 'better-auth/react'

// TODO: Update the baseURL
export const authClient = createAuthClient({
	//baseURL: process.env.BASE_URL!
	baseURL: 'https://' + window.location.hostname
})
