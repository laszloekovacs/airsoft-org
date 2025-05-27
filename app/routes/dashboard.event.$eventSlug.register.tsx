import { eq } from "drizzle-orm"
import { useActionData, useFetcher } from "react-router"
import { z } from "zod"
import { userAtEventTable, userAtEventView } from "~/schema/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.register"
import { ApplicationListContainer } from "~/components/ApplicationList"

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
	const usersAtEvent = await database
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

	// application id
	function handleAccept(id: number) {
		fetcher.submit(
			{
				intent: "accept_application",
				id,
			},
			{ method: "post" },
		)
	}

	return (
		<div>
			<ApplicationListContainer
				applicants={usersAtEvent}
				onAccept={handleAccept}
			/>
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
	const id = actionData.get("id") as number

	console.log(actionData)

	if (intent == "accept_application") {
		console.log("confirmed")

		// set isConfirmed to true

		const result = await database
			.update(userAtEventTable)
			.set({ isConfirmed: true })
			.where(eq(userAtEventTable.id, id))

		return { status: "ok" }
	}

	return { status: "error" }
}
