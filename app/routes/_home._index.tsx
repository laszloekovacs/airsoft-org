import type { Route } from './+types/_home._index'
import { eventRecord } from '~/schema/schema'
import db from '~/services/db.server'
import { EventList } from '../components/events'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const eventList = await db.select().from(eventRecord)

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
