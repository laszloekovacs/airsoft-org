import { eq } from "drizzle-orm"
import { redirect, useFetcher } from "react-router"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import * as d from "~/schema"
import { AuthenticatedOnly, authServer } from "~/services/auth.server"
import database from "~/services/db.server"
import type { Route } from "./+types/_home.events.$eventId_.apply"

export const loader = async ({ request }: Route.LoaderArgs) => {
	AuthenticatedOnly(request)

	return {}
}

export default function ApplyEventPage() {
	const fetcher = useFetcher()


	return (
		<div>
			<h2>Jelentkezes jatekra</h2>
			<p>feltetelek itt</p>

			<fetcher.Form method="post">
				<Label>
					<span>elfogadom a felteteleket</span>
					<Checkbox name="acceptTerms" id="acceptTerms" />
				</Label>
				<br />
				<input type="hidden" name="intent" value="apply" />
				<Button type="submit" value="Jelentkezek">
					Jelentkezek
				</Button>
			</fetcher.Form>
		</div>
	)
}

export async function action({
	request,
	params,
}: Route.ActionArgs) {
	AuthenticatedOnly(request)
	const sessionData = await authServer.api.getSession(request)

	if (!sessionData) {
		throw new Error("Session not found")
	}

	const { user } = sessionData

	// find event id from stub
	const event = await database
		.select()
		.from(d.eventsTable)
		.where(eq(d.eventsTable.slug, params.eventId))

	// create an entry in the application
	const result = await database.insert(d.eventUserTable).values({
		userId: user.id,
		eventId: event[0].id,
	})

	// go back to Event Page
	return redirect("/")
}
