import { Summary } from "../components/summary"
import type { Route } from "./+types/dashboard._index"
import { eventRecordTable } from "~/schema"
import database from "~/services/db.server"
import { OrganizersEventList } from "~/components/dashboard/organizers_event_list"

export const loader = async () => {
	const events = await database.select().from(eventRecordTable)

	return events
}

export default function DashboardIndexPage({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<OrganizersEventList events={[]} />
			<Summary events={loaderData} />
		</div>
	)
}
