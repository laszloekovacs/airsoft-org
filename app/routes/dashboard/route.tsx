import { Link, Outlet } from 'react-router'
import Sitemap from '~/routes/_home/sitemap'
import type { Route } from './+types/route'
import db from '~/services/db.server'
import { eventsTable } from '~/db/schema'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const events = await db.select().from(eventsTable)

	return { events }
}

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
	const { events } = loaderData

	return (
		<div>
			<Link to='/dashboard'>
				<h1>Dashboard</h1>
			</Link>
			<Outlet />
			<Sitemap />
		</div>
	)
}
