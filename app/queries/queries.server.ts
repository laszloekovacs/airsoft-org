import { user } from '~/schema/auth-schema'
import { eventRecord } from '~/schema/schema'
import db from '~/services/db.server'

export async function getEvents() {
	const events = await db.select().from(eventRecord)
	return events
}

export async function getUsers() {
	const users = await db.select().from(user)
	return users
}

export const queries = {
	getEvents,
	getUsers,
}
