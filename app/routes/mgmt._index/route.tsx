import type { Route } from './+types/route'

export const loader = async () => {
	return { status: 'ok' }
}

export default function MgmtPageIndex() {
	return <p>management page</p>
}
