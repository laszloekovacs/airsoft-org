import type { Route } from './+types/_home._index'
import { EventList } from '../components/events'
import Sitemap from '~/components/sitemap'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const eventsData = [
		{
			id: 1,
			title: 'Event 1',
			description: 'Description for Event 1',
			date: '2023-10-01',
			location: 'Location 1'
		},
		{
			id: 2,
			title: 'Event 2',
			description: 'Description for Event 2',
			date: '2023-10-02',
			location: 'Location 2'
		},
		{
			id: 3,
			title: 'Event 3',
			description: 'Description for Event 3',
			date: '2023-10-03',
			location: 'Location 3'
		},
		{
			id: 4,
			title: 'Event 4',
			description: 'Description for Event 4',
			date: '2023-10-04',
			location: 'Location 4'
		}
	]

	return { eventsData }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { eventsData } = loaderData

	return (
		<div>
			<h1>Home</h1>
			<EventList events={eventsData} />
		</div>
	)
}
