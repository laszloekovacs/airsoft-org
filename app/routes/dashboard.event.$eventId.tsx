import { Link, Outlet } from 'react-router'
import type { Route } from './+types/dashboard.event.$eventId'

export const loader = async ({ params }: { params: { eventId: string } }) => {
	// Simulate fetching event data based on eventId
	const eventData = {
		id: params.eventId,
		name: `Event name`,
		description: `Description for event ${params.eventId}`
	}

	return {
		eventData
	}
}

export default function DashboardEventsEventId({
	loaderData
}: Route.ComponentProps) {
	const { id, name, description } = loaderData.eventData

	return (
		<div>
			<h2>{name}</h2>
			<p>{description}</p>

			<TabList />

			<Outlet />
		</div>
	)
}

const TabList = () => {
	return (
		<ul>
			<li>Details</li>
			<li>Attendees</li>
			<li>Settings</li>
			<li>
				<Link to='./dates'>Dates</Link>
			</li>
		</ul>
	)
}
