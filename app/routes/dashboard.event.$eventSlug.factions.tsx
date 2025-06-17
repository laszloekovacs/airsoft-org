import { eq, sql } from "drizzle-orm"
import { eventRecordTable, factionInfoTable } from "~/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.factions"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Form } from "react-router"
import { number, z } from "zod"

/**
 * Create groups for players to be assigned to
 */

export async function loader({ params }: Route.LoaderArgs) {
	const { eventSlug } = params

	const event = await database
		.select()
		.from(eventRecordTable)
		.where(eq(eventRecordTable.slug, eventSlug))

	// throw if not found
	if (event.length == 0) throw new Error("nincs ilyen esemény")

	// return the factions for this event, can be zero length
	const factions = await database
		.select()
		.from(factionInfoTable)
		.where(eq(factionInfoTable.eventId, event[0].id))

	return { event: event[0], factions }
}

export default function EditEventGroupsPage({
	loaderData,
}: Route.ComponentProps) {
	const { event, factions } = loaderData

	return (
		<div>
			<h1>Csoportok</h1>

			<Form method="post" className="max-w-xl flex flex-col gap-2">
				<Input type="hidden" name="eventId" value={event.id} />
				<Input type="hidden" name="intent" value="create" />
				<Input type="text" name="faction" />
				<Button type="submit">hozzáad</Button>
			</Form>

			<ul>
				{factions.map((faction) => (
					<li key={faction.id}>
						<p>{faction.name}</p>
					</li>
				))}
			</ul>
		</div>
	)
}

export async function action({ params, request }: Route.ActionArgs) {
	const formData = await request.formData()
	const formObj = Object.fromEntries(formData)

	const actionSchema = z.discriminatedUnion("intent", [
		z.object({
			intent: z.literal("create"),
			faction: z.string(),
			eventId: z.string(),
		}),
		z.object({ intent: z.literal("remove"), index: z.number() }),
	])

	const action = actionSchema.parse(formObj)

	let queryResult = null

	switch (action.intent) {
		case "create":
			queryResult = await database.insert(factionInfoTable).values({
				name: action.faction,
				eventId: Number.parseInt(action.eventId),
			})

			break

		case "remove":
			break

		default:
			throw new Error("unexpected intent")
	}

	return {
		status: "success",
	}
}
