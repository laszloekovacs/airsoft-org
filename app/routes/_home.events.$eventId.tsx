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
			<h1>Event Title for event id {eventId}</h1>
			<p>Organizer: Mike</p>

			<div>
				<p>2025.06.06</p>
				<p>Location: New York</p>
				<p>Max players: 60</p>
				<p>Avalilable slots: 10</p>

				<p>Deadline: Apr. 30</p>
			</div>

			<div>
				<p>Prices</p>
				<p>Early bird: $50</p>
				<p>Regular: $60</p>
				<p>Last minute: $70</p>
			</div>

			<div>
				<button>Apply</button>
			</div>

			<div>
				<p>Tags</p>
				<p>Milsim, retro, etc</p>
			</div>

			<div>
				<p>Rules</p>
				<p>1. No cheating</p>
				<p>2. No stealing</p>
			</div>
		</div>
	)
}
