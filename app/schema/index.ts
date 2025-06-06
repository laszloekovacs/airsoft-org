import { date, integer, pgTable, text, unique } from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

/**
 * Event information table
 */
export const eventRecordTable = pgTable("event_record", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	createdAt: date("created_at")
		.notNull()
		.$default(() => new Date().toISOString()),

	// user id who created the event
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),

	title: text("title").notNull(),

	// generated url. date + title sanitized
	slug: text("slug").notNull().unique(),

	// start date and optional end date for multi day event
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),

	description: text(),

	// approx location, eg: debrecen
	locationSummary: text(),

	// organizers expectation
	expectedParticipants: integer(),
	maximumParticipants: integer(),
	minimumParticipants: integer(),

	// array of links to fb, x, discord etc.
	socialLinks: text("socials").array(),
})

/*
 * user attendance on event many-to-many associative table
 */
export const userAtEventTable = pgTable(
	"user_at_event",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		createdAt: date("created_at")
			.notNull()
			.$default(() => new Date().toISOString()),

		// if user deletes himself, it should display as "deleted user"
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "no action" }),

		// if the event is deleted, delete the applications too, tho the
		// user should be notified of it
		eventId: integer("event_id")
			.notNull()
			.references(() => eventRecordTable.id, { onDelete: "cascade" }),

		// null means the player is in the waiting list.
		factionId: integer("faction_id").references(() => factionInfoTable.id, {
			onDelete: "set null",
		}),
	},
	/* user allowed only once to apply for a single event */
	(table) => [unique().on(table.eventId, table.userId)],
)

/**
 * Description of a faction at an event
 */
export const factionInfoTable = pgTable(
	"faction_info",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		eventId: integer("event_id").references(() => eventRecordTable.id, {
			onDelete: "cascade",
		}),
		name: text().notNull(),
		desciption: text(),

		// intent how many players should be in here
		expectedParticipants: integer("expected_participants"),
	},
	/* teams have to be unique to every event */
	(table) => [unique().on(table.name, table.eventId)],
)

/**
 * Locations or map details for the event
 */

export const siteInformation = pgTable("site_information", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: date("created_at")
		.notNull()
		.$default(() => new Date().toISOString()),

	// name information
	name: text(),
	alias: text(),

	// vanilla address data
	address1: text(),
	address2: text(),
	city: text(),
	state: text(),
	zip: text(),

	// geolocation
})
