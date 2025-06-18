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
import { AuthorizedOnly } from "~/services/auth.server"

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

type ActionResult = { ok: true } | { ok: false; reason?: string }

export default function EditEventFactionsPage({
	loaderData,
}: Route.ComponentProps) {
	const { event, factions } = loaderData
	const data = useActionData<ActionResult>()
	const formRef = useRef<HTMLFormElement | null>(null)

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
		eventId: z.coerce.number(),
	})

	const removeSchema = z.object({
		intent: z.literal("remove"),
		factionId: z.coerce.number(),
	})

	const actionSchema = z.discriminatedUnion("intent", [
		createSchema,
		removeSchema,
	])

	const action = actionSchema.safeParse(formObj)

	if (!action.success) {
		return {
			ok: false,
			reason: action.error.errors.flat().toString(),
		}
	}

	// check for credentials, get user
	const { user } = await AuthorizedOnly(request, ["organizer"])

	if (action.data.intent == "create")
		return await createFaction(
			user.id,
			action.data.eventId,
			action.data.faction,
		)
	if (action.data.intent == "remove")
		return await removeFaction(user.id, action.data.factionId)

	return {
		ok: true,
	}
}

const createFaction = async (
	userId: string,
	eventId: number,
	name: string,
): Promise<ActionResult> => {
	// check if event getting edited is owned by user; event exists
	const [event] = await database
		.select()
		.from(eventRecordTable)
		.where(eq(eventRecordTable.id, eventId))
	if (!event) throw data("nincs ilyen esemény", { status: 404 })

	// check if user is the owner of the event
	if (event.ownerId != userId)
		throw data("nincs jogosultságod esemény szerkesztéséhez", { status: 403 })

	try {
		// insert new faction
		const [faction] = await database
			.insert(factionInfoTable)
			.values({ eventId, name })
			.returning()
	} catch (error: unknown) {
		console.log(error)
		// TODO: check what the error code is for duplicates, return actionResult otherwise rethrow to handle in errorboundary
	}

	return {
		ok: true,
	}
}

const removeFaction = async (
	userId: string,
	factionId: number,
): Promise<ActionResult> => {
	return {
		ok: false,
		reason: "not implemented yet",
	}
}
