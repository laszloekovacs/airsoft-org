import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { eq } from "drizzle-orm"
import { event_records, event_user_records } from "~/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug._index"
import { state } from "@formkit/drag-and-drop"

/**
 *
 */
export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const { eventSlug } = params

	// get event from slug
	const event = await database
		.select()
		.from(event_records)
		.where(eq(event_records.slug, eventSlug))

	if (event.length == 0) throw new Error()

	const attendees = await database
		.select()
		.from(event_user_records)
		.where(eq(event_user_records.eventId, event[0].id))

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
			<h1>csapatok</h1>
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
