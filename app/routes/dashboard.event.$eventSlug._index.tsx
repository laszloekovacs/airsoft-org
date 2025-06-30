import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { eq } from "drizzle-orm"
import * as d from "~/schema"
import { user } from "~/schema/auth-schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug._index"

/**
 *
 */
export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const { eventSlug } = params

	// get event from slug
	const event = await database
		.select()
		.from(d.eventsTable)
		.where(eq(d.eventsTable.slug, eventSlug))

	if (event.length == 0) throw new Error()

	// get the users and group them by faction
	const attendees = await database
		.select()
		.from(d.eventUserTable)
		.where(eq(d.eventUserTable.eventId, event[0].id))
		.innerJoin(user, eq(user.id, d.eventUserTable.userId))
		.groupBy(d.eventUserTable.id, d.eventUserTable.factionId, d.eventUserTable.userId, user.id)


	// query the users by group


	return { attendees }
}


export default function RegistrationPage({ loaderData }: Route.ComponentProps) {

	return (
		<div>
			<pre>{JSON.stringify(loaderData, null, 2)}</pre>
		</div>
	)
}
