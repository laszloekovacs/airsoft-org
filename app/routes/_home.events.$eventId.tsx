import database from "~/services/db.server"
import type { Route } from "./+types/_home.events.$eventId"
import { eventRecordTable, userAtEventTable } from "~/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { Link } from "react-router"
import { authServer } from "~/services/auth.server"
import { Button } from "~/components/ui/button"

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)
	let alreadyApplied = false

	const event = await database
		.select()
		.from(eventRecordTable)
		.where(eq(eventRecordTable.slug, params.eventId))

	if (!event) {
		throw new Response("Event not found", { status: 404 })
	}

	// look up if already applied. 

	if (sessionData) {
		const applications = await database.select().from(userAtEventTable).where(
			and(eq(userAtEventTable.userId, sessionData.user.id), eq(userAtEventTable.eventId, event[0].id))
		)

		if (applications.length > 0) {
			alreadyApplied = true
		}
	}

	return { event: event[0], user: sessionData?.user, alreadyApplied }
}

export default function EventDetailPage({ loaderData }: Route.ComponentProps) {
	const { event, alreadyApplied, user } = loaderData

	return (
		<div>


			<h1>{event.title}</h1>
			<p>{event.date}</p>



			{/* user is logged out */}
			{!user && (
				<p>jelentkezéshez lépj be!</p>
			)}

			{/* user is logged in and has already applied */}
			{user && alreadyApplied && (
				<p>már jelentkeztél!</p>
			)}

			{/* user is logged in and has not applied */}
			{user && !alreadyApplied && (
				<Button asChild>
					<Link to="apply">jelentkezek</Link>
				</Button>
			)}
		</div>
	)
}
