import { Summary } from './summary'
import type { Route } from './+types/route'
import { eventRecord } from '~/schema/schema'
import db from '~/services/db.server'

export const loader = async ({ params }: { params: Route.LoaderArgs }) => {
	const events = await db.select().from(eventRecord)

	return events
}

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<Summary events={loaderData} />
		</div>
	)
}
