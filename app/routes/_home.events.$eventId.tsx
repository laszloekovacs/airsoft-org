import db from '~/services/db.server'
import type { Route } from './+types/_home.events.$eventId'
import { eventsTable } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { Link } from 'react-router'

export const loader = async ({ params }: Route.LoaderArgs) => {
	const event = await db
		.select()
		.from(eventsTable)
		.where(eq(eventsTable.urlSlug, params.eventId))

	if (!event) {
		throw new Response('Event not found', { status: 404 })
	}

	return { event: event[0] }
}

export default function EventDetailPage({ loaderData }: Route.ComponentProps) {
	const { event } = loaderData

	return (
		<div>
			<h1>{event.title}</h1>
			<p>{event.date}</p>

			<Link to='./apply'>Jelentkezek</Link>
		</div>
	)
}
