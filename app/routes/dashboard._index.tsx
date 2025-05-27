import { Summary } from "../components/summary"
import type { Route } from "./+types/dashboard._index"
import { eventTable } from "~/schema/schema"
import database from "~/services/db.server"

export const loader = async ({ params }: { params: Route.LoaderArgs }) => {
	const events = await database.select().from(eventTable)

	return events
}

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<Summary events={loaderData} />
		</div>
	)
}
