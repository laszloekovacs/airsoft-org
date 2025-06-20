import { user } from "~/schema/auth-schema"
import { event_records } from "~/schema"
import database from "~/services/db.server"

export async function getEvents() {
	const events = await database.select().from(events)
	return events
}

export async function getUsers() {
	const users = await database.select().from(user)
	return users
}

export const queries = {
	getEvents,
	getUsers,
}
