import { userAtEventTable, eventRecord, userAtEventView } from "~/schema/schema"
import db from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventId.register"
import { eq } from "drizzle-orm"
import { user } from "~/schema/auth-schema"
import { useActionData, useFetcher } from "react-router"
import { Button } from "~/components/ui/button"

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const { eventId } = params

	// TODO get user and check if event is his
	// check for claim that he's an organizer
	const filter = { id: userAtEventTable.id }

	// retrieve users that have applied to this event
	const usersAtEvent = await db.select().from(userAtEventView)

	return { usersAtEvent }
}

export default function RegistrationPage({ loaderData }: Route.ComponentProps) {
	const { usersAtEvent } = loaderData

	const fetcher = useFetcher()
	const actionData = useActionData<{ status: "ok" | "error" }>()

	const processApplicationApproval = async () => {
		await fetcher.submit(
			{ intent: "confirm", eventId: "1" },
			{ method: "post" },
		)
	}

	return (
		<div>
			<pre>{JSON.stringify(loaderData, null, 2)}</pre>
		</div>
	)
}

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
