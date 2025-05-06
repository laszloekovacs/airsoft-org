import type { Route } from './+types/_home._index'
import { EventList } from '../components/home/events'
import db from '~/services/db.server'
import { eventsTable } from '~/db/schema'
import { eq } from 'drizzle-orm'

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
