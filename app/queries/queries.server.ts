import { eventRecord } from '~/schema/schema'
import db from '~/services/db.server'

export async function getEvents() {
	const events = await db.select().from(eventRecord)

	return events
}

export const queries = {
	getEvents,
}
