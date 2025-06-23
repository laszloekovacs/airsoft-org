import * as d from "~/schema"
import { user } from "~/schema/auth-schema"
import database from "~/services/db.server"

export async function getEvents() {
	const events = await database.select().from(d.eventsTable)
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
