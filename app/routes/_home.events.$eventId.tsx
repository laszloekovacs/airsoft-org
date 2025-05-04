import type { Route } from './+types/_home.events.$eventId'

export const loader = async ({ params }: Route.LoaderArgs) => {
	return {
		eventId: params.eventId
	}
}

export default function EventDetailPage({ loaderData }: Route.ComponentProps) {
	const { eventId } = loaderData

	return (
		<div>
			<h1>Event Detail Page for event id {eventId}</h1>
			<p>This is the event detail page.</p>
		</div>
	)
}
