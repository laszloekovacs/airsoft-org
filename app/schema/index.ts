import * as t from "drizzle-orm/pg-core"
import { user } from "./auth-schema"
import { sql } from "drizzle-orm"

export const eventState = t.pgEnum("event_state", [
	"draft",
	"publised",
	"cancelled",
])

export const signupState = t.pgEnum("signup_state", [
	"pending",
	"waitlisted",
	"assigned",
	"rejected",
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
			.$defaultFn(() => sql`now()`)
			.notNull(),

		// support for soft deletion
		deletedAt: t.timestamp({ withTimezone: true }),

		updatedAt: t
			.timestamp({ withTimezone: true })
			.notNull()
			.$onUpdate(() => sql`now()`),

		title: t.text().notNull(),

		// header image url
		image: t.text(),

		// freeform tags. eg: milsim, free, practice
		tags: t.text().array(),

		// markdown or string form of description
		description: t.text(),

		// by default it is a public game and advertised.
		isPrivate: t.boolean().notNull().default(false),

		// allow user to edit event before publishing
		eventState: eventState()
			.notNull()
			.$default(() => "draft"),

		// user id who created the event. on deletion the event should survive the users deletion
		// for record keeping
		ownerId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "set null" }),

		// generated url. date + title sanitized (eg: 2025-mikulasvaro)
		slug: t.text().notNull().unique(),

		// start date and optional end date for multi day event
		// event schedule times are stored in a timetable
		startDate: t.date().notNull(),
		endDate: t.date(),

		// optional signup deadline, no checks on this
		signupDeadline: t.timestamp({ withTimezone: true }),

		// optional display price info, no checks. null means not provided, 0 = free
		displayPrice: t.numeric({ precision: 10, scale: 2 }),
		displayPriceCurrency: t.text().default("HUF").notNull(),

		// text description of approx location, eg: Debrecen
		locationSummary: t.text().notNull(),

		// detailed location information
		location: t.integer().references(() => siteInformationTable.id, {
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
		t.check(
			"event_starts_at_least_tomorrow",
			sql`${table.startDate} >= (CURRENT_DATE + INTERVAL '1 day')`,
		),
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
		t.check(
			"valid_slug",
			sql`${table.slug} ~ '^[a-z0-9-]+$' AND LENGTH(${table.slug}) BETWEEN 3 AND 50`,
		),
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
			.$defaultFn(() => sql`now()`)
			.notNull(),

		// user has signed up to the event, represents the decision of the organizer
		signupState: signupState(),
		// the reason given by the organizer
		rejectionReason: t.text(),

		// is this application cancelled by the user? if so why?
		isCancelled: t.boolean().default(false),
		cancellationReason: t.text(),

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
			sql`${table.expectedParticipants} IS NULL OR ${table.expectedParticipants} > 0`,
		),
	],
)

/**
 * Locations or map details for the event
 */

export const siteInformationTable = t.pgTable(
	"site_information",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => sql`now()`)
			.notNull(),

		// name, splash image and description
		name: t.text().notNull(),
		alias: t.text(),

		// optional description and splash image
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

/**
 * prices table. eg: entry fee, rental gear, welcome drink etc.
 */
export const serviceFeeRecord = t.pgTable(
	"service_fee",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

		// reference to the event, deletes when event gets removed
		eventId: t
			.integer()
			.notNull()
			.references(() => eventRecordTable.id, {
				onDelete: "cascade",
			}),

		// allows for price change notification
		updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => sql`now()`),

		label: t.text().notNull(),
		ammount: t.integer().notNull(),
		currency: t
			.text()
			.notNull()
			.$default(() => "HUF"),
	},
	(table) => [
		t.check("ammount_must_be_positive_or_zero", sql`${table.ammount} >= 0`),
	],
)

/**
 * timeline of the event: eg: breakfast, orientation, play, end
 */
export const timelineTable = t.pgTable("timeline", {
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

	// reference to the event, deletes when event gets removed
	eventId: t
		.integer()
		.notNull()
		.references(() => eventRecordTable.id, {
			onDelete: "cascade",
		}),

	// allows for notification on change
	updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => sql`now()`),

	// description and timestamp of planned ativities: eg: opening: 9:00am,
	// there should be no check: eg: people could gather for a bus 2 hours before start.
	label: t.text().notNull(),
	timestamp: t.timestamp().notNull(),

	// if some parts are on a different day than the main event, it's helpfull to show full date. Sould this be automated?
	displayLongDateTime: t.boolean().notNull().default(false),
})
