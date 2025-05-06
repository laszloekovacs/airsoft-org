export const throwIfNotAuthenticated = (request: Request) => {
	return

	throw new Response('Not authenticated', { status: 401 })
}
