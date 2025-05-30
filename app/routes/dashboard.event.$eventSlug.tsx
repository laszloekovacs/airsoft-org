import { Link, Outlet } from "react-router"
import type { Route } from "./+types/dashboard.event.$eventSlug"
import { ArrowLeft } from "lucide-react"

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

			<Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Vissza az eseményekhez
			</Link>


			<Outlet />
		</div>
	)
}
