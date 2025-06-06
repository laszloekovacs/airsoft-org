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

	// persons user id who created the event
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	title: text("name").notNull(),

	// generated url
	slug: text("slug").notNull().unique(),

	// start date and optional end date for multi day event
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),

	description: text(),
	// approx location, eg: debrecen
	location_summary: text(),

	expected_participants: integer(),
	min_participants: integer(),

	// array of links to fb, x, discord etc.
	social_links: text().array(),
})

/*
 * user attendance on event many-to-many associative table
 */
export const userAtEventTable = pgTable(
	"user_at_event",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "set null" }),
		eventId: integer("event_id")
			.notNull()
			.references(() => eventRecordTable.id, { onDelete: "set null" }),
		createdAt: date("created_at")
			.notNull()
			.$default(() => new Date().toISOString()),
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
		eventId: integer("id").references(() => eventRecordTable.id, {
			onDelete: "cascade",
		}),
		name: text().notNull(),
		desciption: text(),
		expected_participants: integer().notNull().default(0),
	},
	/* teams have to be unique for every event */
	(table) => [unique().on(table.name, table.eventId)],
)
