import { useFetcher } from 'react-router'
import type { Route } from './+types/_home.events.$eventId_.apply'
import { AuthenticatedOnly, authServer } from '~/services/auth.server'
import db from '~/services/db.server'
import { eventAttendeesTable, eventsTable } from '~/db/schema'
import { eq } from 'drizzle-orm'

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

			<fetcher.Form method='post'>
				<label>
					<span>elfogadom a felteteleket</span>
					<input type='checkbox' name='acceptTerms' id='acceptTerms'></input>
				</label>
				<br />
				<input type='hidden' name='intent' value='apply' />
				<input type='submit' value='Jelentkezek' />
			</fetcher.Form>
		</div>
	)
}

type ErrorResponse = {
	status: 'error'
	reason: string
}

type SuccessResponse = {
	status: 'success'
	message: string
}

type ActionResponse = ErrorResponse | SuccessResponse

export async function action({
	request,
	params
}: Route.ActionArgs): Promise<ActionResponse> {
	AuthenticatedOnly(request)
	const sessionData = await authServer.api.getSession(request)

	if (!sessionData) {
		throw new Error('Session not found')
	}

	const { user } = sessionData

	// find event id from stub
	const event = await db
		.select()
		.from(eventsTable)
		.where(eq(eventsTable.urlSlug, params.eventId))

	// create an entry in the application
	const result = await db.insert(eventAttendeesTable).values({
		userId: user.id,
		eventId: event[0].id
	})

	if (result.rowsAffected != 1) {
		return {
			status: 'error',
			reason: 'Sikertelen jelentkezés!'
		}
	}

	return {
		status: 'success',
		message: 'Sikeres jelentkezés!'
	}
}
