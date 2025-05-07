import { Outlet, Link } from 'react-router'
import Sitemap from '~/components/sitemap'
import type { Route } from './+types/_home'
import { authServer } from '~/services/auth.server'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)

	return sessionData
}

export default function HomeContainer({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<h1>
				<Link to='/'>Airsoft Naptár</Link>
			</h1>
			<Session name={loaderData?.user?.name} />
			<Outlet />
			<Sitemap />
		</div>
	)
}

const Session = ({ name }: { name?: string }) => {
	return <>{name && <span>{name}</span>}</>
}
