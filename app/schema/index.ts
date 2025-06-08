import * as t from "drizzle-orm/pg-core"
import { user } from "./auth-schema"
import { sql } from "drizzle-orm"

export const eventState = t.pgEnum("event_state", [
	"draft",
	"publised",
	"cancelled",
])

/**
 * Event information table
 */
export const eventRecordTable = t.pgTable(
	"event_record",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => /* @__PURE__ */ sql`now()`)
			.notNull(),

		// support for soft deletion
		deletedAt: t.timestamp({ withTimezone: true }),

		// TODO: make this auto
		updatedAt: t.timestamp({ withTimezone: true }),

		// freeform tags. eg: milsim, free, practice
		tags: t.text().array(),

		// header image url
		image: t.text(),

		// by default it is a public game and advertised.
		isPrivate: t.boolean().notNull().default(false),

		// allow user to edit event before publishing
		eventState: eventState(),

		// user id who created the event. on deletion the event should survive the users deletion
		// for record keeping
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

		// optional signup deadline, no checks on this
		signupDeadline: t.timestamp({ withTimezone: true }),

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
		// should be tomorrow at least
		t.check("event_starts_in_the_future", sql`${table.startDate} > now()`),

		t.check(
			"end_date_is_later_than_start_date",
			sql`${table.endDate} > ${table.startDate} OR ${table.endDate} IS NULL`,
		),
		t.check(
			"min_participants_are_less_than_max",
			sql`
        ${table.minimumParticipants} IS NULL OR
        ${table.maximumParticipants} IS NULL OR
        ${table.minimumParticipants} < ${table.maximumParticipants}
      `,
		),
		t.check(
			"expected_within_bounds",
			sql`
        ${table.minimumParticipants} IS NULL OR
        ${table.maximumParticipants} IS NULL OR
        ${table.expectedParticipants} IS NULL OR
        ${table.expectedParticipants} >= ${table.minimumParticipants} AND
        ${table.expectedParticipants} <= ${table.maximumParticipants}
      `,
		),
		t.check(
			"expected_is_positive_number",
			sql`${table.expectedParticipants} IS NULL OR ${table.expectedParticipants} > 0`,
		),
		t.check(
			"minimum_is_positive_number",
			sql`${table.minimumParticipants} IS NULL OR ${table.minimumParticipants} > 0`,
		),
		t.check(
			"maximum_is_positive_number",
			sql`${table.maximumParticipants} IS NULL OR ${table.maximumParticipants} > 0`,
		),
		t.check("valid_slug", sql`${table.slug} ~ '^[a-z0-9-]+$'`),
		t.check("slug_is_long_enough", sql`${table.slug} LENGTH BETWEEN 7 AND 256`),
		t.index("idx_event_location").on(table.location),
	],
)

/*
 * user attendance on event many-to-many associative table
 */
export const userAtEventTable = t.pgTable(
	"user_at_event",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

		// time the user applied to the event
		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => /* @__PURE__ */ sql`now()`)
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
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

		// remove if the event is deleted
		eventId: t
			.integer()
			.notNull()
			.references(() => eventRecordTable.id, {
				onDelete: "cascade",
			}),

		// name and description with potional image
		name: t.text().notNull(),
		description: t.text(),
		image: t.text(),

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

		// name, splash image and description
		name: t.text().notNull(),
		alias: t.text(),

		description: t.text(),
		image: t.text(),

		// vanilla address data
		city: t.text().notNull(),
		zip: t.text().notNull(),
		address1: t.text().notNull(),
		address2: t.text(),
		state: t.text(),

		// international support, hidden from users if default
		country: t
			.text()
			.notNull()
			.$default(() => "Magyarország"),

		// optional GPS Coordinates in a PostGIS Point form
		coordinates: t.customType({
			dataType() {
				return "geometry(POINT, 4326)"
			},
		})(),

		longitude: t.doublePrecision(),
		latitude: t.doublePrecision(),
	},
	(table) => [
		// Ensure the geometry is a valid Point or NULL
		t.check(
			"valid_point_or_null",
			sql`
        ${table.coordinates} IS NULL OR
        ST_GeometryType(${table.coordinates}) = 'ST_Point'
      `,
		),
		// Ensure valid coordinates when not NULL
		t.check(
			"valid_coordinates_or_null",
			sql`
        ${table.coordinates} IS NULL OR
        (ST_X(${table.coordinates}) BETWEEN -180 AND 180 AND
         ST_Y(${table.coordinates}) BETWEEN -90 AND 90)
      `,
		),
		// Create a GIST index for spatial queries
		// apparently it takes a lot of time, concurrently is recommended. see gis doc
		t
			.index("idx_site_coordinates")
			.using("GIST", table.coordinates)
			.concurrently(),
	],
)
