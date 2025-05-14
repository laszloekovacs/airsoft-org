import { AuthenticatedOnly } from '~/services/auth.server'
import type { Route } from './+types/route'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { session, user } = await AuthenticatedOnly(request)

	return { session, user }
}

export default function AccountPage({
	loaderData
}: {
	loaderData: Route.LoaderArgs
}) {
	return (
		<div>
			<h1>Fiók információ</h1>
			<pre>{JSON.stringify(loaderData, null, 2)}</pre>
		</div>
	)
}
