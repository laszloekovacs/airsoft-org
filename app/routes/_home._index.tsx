import { EventList } from '~/components/home/EventList'
import { queries } from '~/queries/queries.server'
import type { Route } from './+types/_home._index'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const eventList = await queries.getEvents()
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
