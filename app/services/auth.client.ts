import { createAuthClient } from 'better-auth/react'
// change import from better-auth/react
// TODO: Update the baseURL
export const authClient = createAuthClient({
	baseURL: window.location.protocol + window.location.hostname
})
