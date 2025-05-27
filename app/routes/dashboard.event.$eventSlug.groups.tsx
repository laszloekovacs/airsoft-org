import { eq, sql } from "drizzle-orm"
import { eventTable } from "~/schema/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.groups"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Form } from "react-router"
import { z } from "zod"

/**
 * Create groups for players to be assigned to
 */

export async function loader({ params }: Route.LoaderArgs) {
	const { eventSlug } = params

	const event = await database
		.select()
		.from(eventTable)
		.where(eq(eventTable.slug, eventSlug))

	// throw if not found
	if (event.length == 0) throw new Error("nincs ilyen esemény")

	return { event: event[0] }
}

export default function EditEventGroupsPage({
	loaderData,
}: Route.ComponentProps) {
	const { event } = loaderData
	const { groups } = event

	return (
		<div>
			<h1>Csoportok</h1>

			<Form method="post">
				<Input type="text" name="group" />
				<Input type="hidden" name="intent" value="add" />
				<Button type="submit">hozzáad</Button>
			</Form>

			<ul>
				{groups.map((group) => (
					<li key={group} className="flex flex-row gap-4">
						<p>{group}</p>

						<Form method="post">
							<Input type="hidden" name="group" value={group} />
							<Input type="hidden" name="intent" value="remove" />
							<Button type="submit">töröl</Button>
						</Form>
					</li>
				))}
			</ul>
		</div>
	)
}

export async function action({ params, request }: Route.ActionArgs) {
	const { eventSlug } = params
	const formData = await request.formData()
	const formObj = Object.fromEntries(formData)

	const formSchema = z.object({
		group: z.string(),
		intent: z.string(),
	})

	const { group, intent } = formSchema.parse(formObj)

	if (intent == "add") {
		await database
			.update(eventTable)
			.set({
				groups: sql`ARRAY_APPEND(groups, ${group})`,
			})
			.where(eq(eventTable.slug, eventSlug))
	} else if (intent == "remove") {
		await database
			.update(eventTable)
			.set({
				groups: sql`ARRAY_REMOVE(groups, ${group})`,
			})
			.where(eq(eventTable.slug, eventSlug))
	}
}
