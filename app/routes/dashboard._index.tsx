import type { Route } from "./+types/dashboard._index"
import { eventRecordTable } from "~/schema"
import database from "~/services/db.server"
import { OrganizersEventList } from "~/components/dashboard/organizers_event_list"
import { Link } from "react-router"

export const loader = async () => {
	const events = await database.select().from(eventRecordTable)

	return { events }
}

export default function DashboardIndexPage({
	loaderData,
}: Route.ComponentProps) {
	const { events } = loaderData

	return (
		<div className="p-4">
			<Link className="underline" to="/dashboard/event/create">esemény létrehozása</Link>
			<OrganizersEventList events={events} />
		</div>
	)
}
