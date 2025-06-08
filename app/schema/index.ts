import * as t from "drizzle-orm/pg-core"
import { user } from "./auth-schema"
import { sql } from "drizzle-orm"

/**
 * Event information table
 */
export const eventRecordTable = t.pgTable(
	"event_record",
	{
		id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),

		// support for soft deletion
		deletedAt: t.timestamp({ withTimezone: true }),

		updatedAt: t.timestamp({ withTimezone: true }),

		// user id who created the event
		ownerId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "set null" }),

		title: t.text().notNull(),

		// generated url. date + title sanitized (eg: 2025-mikulasvaro)
		slug: t.text().notNull().unique(),

		// start date and optional end date for multi day event
		// event schedule times are stored in a timetable
		startDate: t.date().notNull(),
		endDate: t.date(),

		// markdown or string form of description
		description: t.text(),

		// text description of approx location, eg: Debrecen
		locationSummary: t.text().notNull(),

		// detailed location information
		location: t.integer().references(() => siteInformation.id, {
			onDelete: "set null",
		}),

		// organizers expectation
		expectedParticipants: t.integer(),
		maximumParticipants: t.integer(),
		minimumParticipants: t.integer(),

		// array of links to fb, x, discord etc or even phone number.
		socials: t.text("socials").array(),
	},
	(table) => [
		t.check("valid_slug_format", sql`${table.slug} ~ '^[a-z0-9-]+$'`),
		t.check(
			"end_date_is_later_than_start_date",
			sql`${table.endDate} > ${table.startDate}`,
		),
		t.check(
			"min_participants_are_less_than_max",
			sql`${table.minimumParticipants} < ${table.maximumParticipants}`,
		),
		t.check(
			"expected_is_positive_number",
			sql`${table.expectedParticipants} > 0`,
		),
		t.check(
			"minimum_is_positive_number",
			sql`${table.minimumParticipants} > 0`,
		),
		t.check(
			"maximum_is_positive_number",
			sql`${table.maximumParticipants} > 0`,
		),
	],
)

/*
 * user attendance on event many-to-many associative table
 */
export const userAtEventTable = t.pgTable(
	"user_at_event",
	{
		id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),

		// if user deletes himself, it should display as "deleted user"
		userId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "set null" }),

		// if the event is deleted, delete the applications too
		eventId: t
			.integer()
			.notNull()
			.references(() => eventRecordTable.id, { onDelete: "cascade" }),

		// null means the player is in the waiting list.
		factionId: t.integer("faction_id").references(() => factionInfoTable.id, {
			onDelete: "set null",
		}),
	},
	/* user allowed only once to apply for a single event */
	(table) => [t.unique().on(table.eventId, table.userId)],
)

/**
 * Description of a faction at an event
 */
export const factionInfoTable = t.pgTable(
	"faction_info",
	{
		id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),

		// remove if the event is deleted
		eventId: t
			.integer()
			.notNull()
			.references(() => eventRecordTable.id, {
				onDelete: "cascade",
			}),

		name: t.text().notNull(),
		description: t.text(),

		// intent how many players should be in here
		expectedParticipants: t.integer(),
	},
	/* teams have to be unique to every event */
	(table) => [
		t.unique().on(table.name, table.eventId),
		t.check(
			"expected_participants_should_be_positive",
			sql`${table.expectedParticipants} > 0`,
		),
	],
)

/**
 * Locations or map details for the event
 */

export const siteInformation = t.pgTable(
	"site_information",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),

		// name information
		name: t.text().notNull(),
		alias: t.text(),

		// vanilla address data
		country: t
			.text()
			.notNull()
			.$default(() => "Magyarország"),
		address1: t.text().notNull(),
		address2: t.text(),
		city: t.text(),
		state: t.text(),
		zip: t.text(),

		// gps coordinates
		longitude: t.doublePrecision(),
		latitude: t.doublePrecision(),
	},
	(table) => [
		t.check("valid_latitude", sql`${table.latitude} BETWEEN -90 AND 90`),
		t.check("valid_longitude", sql`${table.longitude} BETWEEN -180 AND 180`),
	],
)
