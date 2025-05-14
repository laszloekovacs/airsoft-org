import { userAtEventTable, eventRecord } from '~/db/schema'
import db from '~/services/db.server'
import type { Route } from './+types/route'
import { eq } from 'drizzle-orm'
import { user } from '~/db/auth-schema'
import { useActionData, useFetcher } from 'react-router'

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	// TODO get user and check if event is his
	// check for claim that he's an organizer
	const filter = { id: userAtEventTable.id }

	const data = await db
		.select()
		.from(userAtEventTable)
		.leftJoin(eventRecord, eq(userAtEventTable.eventId, eventRecord.id))
		.leftJoin(user, eq(userAtEventTable.userId, user.id))
		.where(eq(eventRecord.urlSlug, params.eventId))

	return data
}

export default function RegistrationPage({ loaderData }: Route.ComponentProps) {
	const fetcher = useFetcher()
	const actionData = useActionData<{ status: 'ok' | 'error' }>()

	const processApplicationApproval = async () => {
		await fetcher.submit(
			{ intent: 'confirm', eventId: '1' },
			{ method: 'post' }
		)
	}

	return (
		<div>
			<ul>
				{loaderData &&
					loaderData.map(attendee => (
						<li key={attendee.userAtEvent.id}>
							<span>{attendee.user?.name}</span>
							<br />
							<button onClick={processApplicationApproval}>megerosit</button>
						</li>
					))}
			</ul>

			<div>{actionData && actionData.status}</div>

			<div>
				<pre>{JSON.stringify(loaderData, null, 2)}</pre>
			</div>
		</div>
	)
}

export const action = async ({ request }: Route.ActionArgs) => {
	const actionData = await request.formData()
	const intent = actionData.get('intent')?.toString()
	const eventId = actionData.get('id')?.toString() ?? ''

	if (intent == 'confirm') {
		console.log('confirmed')

		// set isConfirmed to true

		const result = await db
			.update(userAtEventTable)
			.set({ isConfirmed: true })
			.where(eq(userAtEventTable.id, parseInt(eventId)))

		return { status: 'ok' }
	}

	return { status: 'error' }
}
