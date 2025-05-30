import { Link, Outlet } from "react-router"
import type { Route } from "./+types/dashboard.event.$eventSlug"

export const loader = async ({ params }: { params: { eventId: string } }) => {
	// Simulate fetching event data based on eventId
	const eventData = {
		id: params.eventId,
		name: params.eventId,
		description: `Description for event ${params.eventId}`,
	}

	return {
		eventData,
	}
}

export default function DashboardEventsEventId({
	loaderData,
}: Route.ComponentProps) {
	const { id, name, description } = loaderData.eventData

	return (
		<div className="min-h-screen bg-background">
			<div>
				<Link to="/">Vissza az eseményekhez</Link>
			</div>

			<Outlet />
		</div>
	)
}
