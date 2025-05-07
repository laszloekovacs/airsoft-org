import { AuthenticatedOnly } from '~/services/auth.server'
import type { Route } from './+types/mgmt'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { user } = await AuthenticatedOnly(request)

	return { user }
}

export default function ManagementPage() {
	return (
		<div>
			<h2>Administration</h2>
		</div>
	)
}
