import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { eq } from "drizzle-orm"
import { eventTable, userAtEventTable } from "~/schema/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.assign"
import { state } from "@formkit/drag-and-drop"

/**
 *
 */
export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const { eventSlug } = params

	// get event from slug
	const event = await database
		.select()
		.from(eventTable)
		.where(eq(eventTable.slug, eventSlug))

	if (event.length == 0) throw new Error()

	const attendees = await database
		.select()
		.from(userAtEventTable)
		.where(eq(userAtEventTable.eventId, event[0].id))

	return { attendees }
}

/**
 *
 * @param param0
 * @returns
 */
export default function RegistrationPage({ loaderData }: Route.ComponentProps) {
	type Item = (typeof attendees)[0]
	const { attendees } = loaderData
	const doneItems: Item[] = []

	const [unasignedRef, attendeeList] = useDragAndDrop<HTMLUListElement, Item>(
		attendees,
		{
			group: "A",
		},
	)

	const [doneRef, dones] = useDragAndDrop<HTMLUListElement, Item>(doneItems, {
		group: "A",

		onDragend(data) {
			console.log(data)
			console.log(doneItems)
		},
	})

	return (
		<div>
			<ul ref={unasignedRef} className="bg-red-200 min-h-18">
				{attendeeList.map((item) => (
					<li key={item.id}>
						<p>{item.userId}</p>
					</li>
				))}
			</ul>

			<ul ref={doneRef} className="bg-amber-200 min-h-18">
				{dones.map((item) => (
					<li key={item.id}>
						<p>{item.userId}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
