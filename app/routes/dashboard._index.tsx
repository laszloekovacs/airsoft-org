import { Summary } from "../components/summary"
import type { Route } from "./+types/dashboard._index"
import { eventRecordTable } from "~/schema/schema"
import database from "~/services/db.server"

export const loader = async ({ params }: { params: Route.LoaderArgs }) => {
	const events = await database.select().from(eventRecordTable)

	return events
}

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<Summary events={loaderData} />
		</div>
	)
}
