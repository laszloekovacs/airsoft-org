import { eq } from "drizzle-orm"
import { useActionData, useFetcher } from "react-router"
import { z } from "zod"
import { userAtEventTable, userAtEventView } from "~/schema/schema"
import db from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.register"
import { ParticipantListContainer } from "~/features/EventRegistrations/ParticipantList"

/**
 *
 * @param param0
 * @returns
 */
export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const { eventSlug } = params

	const validatedSlug = z.string().parse(eventSlug)

	// technically, i should look up the slug in the event and get the
	// id, and from that id i get the usersAtEvent

	// retrieve users that have applied to this event
	const usersAtEvent = await db
		.select()
		.from(userAtEventView)
		.where(eq(userAtEventView.slug, validatedSlug))

	return { usersAtEvent }
}

/**
 *
 * @param param0
 * @returns
 */
export default function RegistrationPage({ loaderData }: Route.ComponentProps) {
	const { usersAtEvent } = loaderData

	const fetcher = useFetcher()
	const actionData = useActionData<{ status: "ok" | "error" }>()

	function handleAccept() {
		alert("ok")
	}

	return (
		<div>
			<ParticipantListContainer
				participants={usersAtEvent}
				onAccept={handleAccept}
			/>
			<hr />
			<pre>{JSON.stringify(usersAtEvent, null, 2)}</pre>
		</div>
	)
}

/**
 *
 * @param param0
 * @returns
 */
export const action = async ({ request }: Route.ActionArgs) => {
	const actionData = await request.formData()
	const intent = actionData.get("intent")?.toString()
	const eventId = actionData.get("id")?.toString() ?? ""

	if (intent == "confirm") {
		console.log("confirmed")

		// set isConfirmed to true

		const result = await db
			.update(userAtEventTable)
			.set({ isConfirmed: true })
			.where(eq(userAtEventTable.id, Number.parseInt(eventId)))

		return { status: "ok" }
	}

	return { status: "error" }
}
