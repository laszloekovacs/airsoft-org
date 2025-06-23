import { eq, and } from "drizzle-orm"
import * as d from "~/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.factions"
import { Input } from "~/components/ui/input"
import { data, Form, useActionData } from "react-router"
import { z } from "zod"
import { useEffect, useRef } from "react"
import { FactionCard } from "~/components/dashboard/faction-card"
import { AuthorizedOnly } from "~/services/auth.server"

export async function loader({ params }: Route.LoaderArgs) {
	const { eventSlug } = params

	const [event] = await database
		.select()
		.from(d.events)
		.where(eq(d.events.slug, eventSlug))

	// throw if event not found
	if (!event) throw data("nincs ilyen esemény", { status: 404 })

	// return the factions for this event, can be zero length
	const factions = await database
		.select()
		.from(d.event_faction_records)
		.where(eq(d.event_faction_records.eventId, event.id))
		.orderBy(d.event_faction_records.name)

	return { event, factions }
}

// TODO: move this somewhere global
type ActionResult = { ok: boolean; reason?: string }

export default function EditEventFactionsPage({
	loaderData,
}: Route.ComponentProps) {
	const { factions } = loaderData
	const data = useActionData<ActionResult>()
	const formRef = useRef<HTMLFormElement>(null)

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
				<Input type="hidden" name="intent" value="create" />
				<Input type="text" name="faction" />
				<input type="submit" name="submit" value="hozzáad" />
			</Form>

			{data?.reason && <p>{data.reason}</p>}

			<ul>
				{factions.map((faction) => (
					<FactionCard key={faction.id} {...faction} />
				))}
			</ul>
		</div>
	)
}

export async function action({ params, request }: Route.ActionArgs) {

	const formObj = Object.fromEntries(await request.formData())

	const createSchema = z.object({
		intent: z.literal("create"),
		faction: z.string().trim().min(3, "név túl rövid").max(50),
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
			reason: action.error.toString(),
		} as ActionResult
	}

	// check for credentials, get user
	const { user } = await AuthorizedOnly(request, ["organizer"])

	if (action.data.intent == "create")
		return await createFaction(user.id, params.eventSlug, action.data.faction)

	if (action.data.intent == "remove")
		return await removeFaction(user.id, action.data.factionId)

	return {
		ok: false,
		reason: "unhandled intent in action",
	} as ActionResult
}

const createFaction = async (
	userId: string,
	eventSlug: string,
	name: string,
): Promise<ActionResult> => {

	const result = await database.transaction(async (tx) => {

		// check if event getting edited is owned by user; event exists
		const [event] = await tx
			.select()
			.from(d.events)
			.where(and(eq(d.events.slug, eventSlug), eq(d.events.ownerId, userId)))

		if (!event) throw data("nincs ilyen esemény", { status: 404 })

		try {
			// insert new faction
			const [faction] = await tx
				.insert(d.event_faction_records)
				.values({ eventId: event.id, name })
				.returning()
		} catch (error: unknown) {
			console.log(error)
			// TODO: check what the error code is for duplicates, return actionResult otherwise rethrow to handle in errorboundary
			// error {code, detail} 23505

			if (typeof error == "object" && error != null && "code" in error && "detail" in error) {
				if (error.code == 23505) {
					return {
						ok: false,
						reason: "már létezik ilyen nevű csoport"
					}
				}
			}

			// handle it in the errorboundary
			throw error
		}

		// end of transaction
	})
	return result as ActionResult
}

const removeFaction = async (
	userId: string,
	factionId: number,
): Promise<ActionResult> => {
	return {
		ok: false,
		reason: "not implemented yet",
	} as ActionResult
}
