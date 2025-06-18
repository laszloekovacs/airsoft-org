import { eq, sql } from "drizzle-orm"
import { eventRecordTable, factionInfoTable } from "~/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.factions"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { data, Form, useActionData } from "react-router"
import { z } from "zod"
import { useEffect, useRef } from "react"
import { FactionCard } from "~/components/dashboard/faction-card"



export async function loader({ params }: Route.LoaderArgs) {
	const { eventSlug } = params

	const [event] = await database
		.select()
		.from(eventRecordTable)
		.where(eq(eventRecordTable.slug, eventSlug))

	// throw if not found
	if (!event) throw data("nincs ilyen esemény", { status: 404 })

	// return the factions for this event, can be zero length
	const factions = await database
		.select()
		.from(factionInfoTable)
		.where(eq(factionInfoTable.eventId, event.id))
		.orderBy(factionInfoTable.name)

	return { event, factions }
}

type ActionResult = | { ok: true } | { ok: false, reason?: string }


export default function EditEventFactionsPage({
	loaderData,
}: Route.ComponentProps) {
	const { event, factions } = loaderData
	const data = useActionData<ActionResult>()
	const formRef = useRef<HTMLFormElement | null>(null)

	/* TODO check user credentials */

	useEffect(() => {
		// clear form on success
		if (data && data.ok == true) {
			formRef.current?.reset()
		}
	}, [data])

	return (
		<div>
			<h1>Csoportok</h1>

			<Form
				method="post"
				className="max-w-xl flex flex-col gap-2"
				ref={formRef}
			>
				<Input type="hidden" name="eventId" value={event.id} />
				<Input type="hidden" name="intent" value="create" />
				<Input type="text" name="faction" />
				<Button type="submit">hozzáad</Button>
			</Form>

			{data && data.ok == false && <p>csapat létrehozása sikertelen</p>}

			<ul>
				{factions.map((faction) => (
					<FactionCard key={faction.id} {...faction} />
				))}
			</ul>
		</div>
	)
}




export async function action({ params, request }: Route.ActionArgs) {
	const formData = await request.formData()
	const formObj = Object.fromEntries(formData)

	const createSchema = z.object({
		intent: z.literal("create"),
		faction: z.string().trim().min(3, "név túl rövid").max(50),
		eventId: z.coerce.number()
	})

	const removeSchema = z.object({
		intent: z.literal("remove"),
		factionId: z.coerce.number()
	})

	const actionSchema = z.discriminatedUnion("intent", [
		createSchema, removeSchema
	])

	const action = actionSchema.parse(formObj)

	//	if(action.intent == "create") return createFaction(action)
	//	if(action.intent == "remove") return removeFaction(action)


	return {
		ok: true,
	}
}
