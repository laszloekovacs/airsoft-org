import { createAuthClient } from 'better-auth/react'

// TODO: Update the baseURL
export const authClient = createAuthClient({
	baseURL: 'http://localhost:3000'
	//	baseURL: 'https://' + window.location.hostname
})
