import { eventsTable } from '~/db/schema'
import db from '~/services/db.server'
import { EventList } from '../components/home/events'
import type { Route } from './+types/_home._index'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const eventList = await db.select().from(eventsTable)

	return { eventList }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { eventList } = loaderData

	return (
		<div>
			<EventList eventList={eventList} />
		</div>
	)
}
