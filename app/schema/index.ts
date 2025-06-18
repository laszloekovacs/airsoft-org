import * as t from "drizzle-orm/pg-core"
import { user } from "./auth-schema"
import { sql } from "drizzle-orm"

export const eventStateEnum = t.pgEnum("event_state", ["draft", "published"])

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
		tags: t.text().array().notNull().default(sql`ARRAY[]::text[]`),

		// markdown or string form of description
		description: t.text(),

		// by default it is a public game and advertised.
		isPrivate: t.boolean().notNull().default(false),

		// game is organized somewhere else, link to that page
		isOffsite: t.boolean().default(false).notNull(),
		offsiteLink: t.text(),

		// allow user to edit event before publishing
		eventState: eventStateEnum()
			.notNull()
			.$default(() => "draft"),

		// user id who created the event. on deletion the event should survive the users deletion
		// for record keeping
		ownerId: t.text().references(() => user.id, { onDelete: "set null" }),

		// other people helping the organizing, list of id's, user id is string
		organizers: t.text().array().notNull(),

		// generated url. date + title sanitized (eg: 2025-mikulasvaro)
		// sould not change when title changes not to corrupt already shared links
		slug: t.text().notNull().unique(),
		//.$defaultFn(() => slugify(`${Date.now}-${this.title}`)),

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
		location: t.integer().references(() => siteInfoTable.id, {
			onDelete: "set null",
		}),

		// organizers expectation
		expectedParticipants: t.integer(),
		maximumParticipants: t.integer(),
		minimumParticipants: t.integer(),

		// array of links to fb, x, discord etc or even phone number.
		socials: t.text("socials").array().notNull().default(sql`ARRAY[]::text[]`),
	},
	(table) => [
		// postgres built in tsvector for search
		// https://orm.drizzle.team/docs/guides/postgresql-full-text-search
		// check causes error, array needs to be immutable?
		// possibly index the title only, ranking can be done during query
		/*
		t
			.index("search_index")
			.using(
				"gin",
				sql`(
          			setweight(to_tsvector('hungarian', ${table.title}), 'A') ||
          			setweight(to_tsvector('hungarian', array_to_string(${table.tags}, ' ')), 'B')
      			)`,
			),
   
*/
		// check current date is with timezone? different check logic?
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
		t.index("idx_event_start_date").on(table.startDate),
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

		// organizer rejected the user
		isRejected: t.boolean().default(false),

		// player withdrew his application
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
		id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),

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

export const siteInfoTable = t.pgTable(
	"site_info",
	{
		id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),

		createdAt: t
			.timestamp({ withTimezone: true })
			.$defaultFn(() => sql`now()`)
			.notNull(),

		// owner, if deleted the site gets purged too
		ownerId: t
			.text("owner_id")
			.references(() => user.id, { onDelete: "cascade" }),

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

		// gps coordinates
		// https://orm.drizzle.team/docs/guides/point-datatype-psql
		location: t.point("location", { mode: "tuple" }),
	},
	(table) => [
		t.check(
			"coordinates_must_be_valid_lat_long",
			sql`
				${table.location} IS NULL OR
				(
					abs(${table.location}[0]) <= 90 AND
					abs(${table.location}[1]) <= 180
				)
			`,
		),
	],
)

/**
 * prices table. eg: entry fee, rental gear, welcome drink etc.
 */
export const serviceFeeRecord = t.pgTable(
	"service_fee",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

		// allows for price change notification
		updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => sql`now()`),

		// reference to the event, deletes when event gets removed
		eventId: t
			.integer()
			.notNull()
			.references(() => eventRecordTable.id, {
				onDelete: "cascade",
			}),

		label: t.text().notNull(),
		amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
		currency: t
			.text()
			.notNull()
			.$default(() => "HUF"),
	},
	(table) => [
		t.check("ammount_must_be_positive_or_zero", sql`${table.amount} >= 0`),
	],
)

/**
 * timeline of the event: eg: breakfast, orientation, play, end
 */
export const timelineTable = t.pgTable("timeline", {
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

	// allows for notification on change
	updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => sql`now()`),

	// reference to the event, deletes when event gets removed
	eventId: t
		.integer()
		.notNull()
		.references(() => eventRecordTable.id, {
			onDelete: "cascade",
		}),

	// description and timestamp of planned ativities: eg: opening: 9:00am,
	// there should be no check: eg: people could gather for a bus 2 hours before start.
	label: t.text().notNull(),
	timestamp: t.timestamp().notNull(),

	// if some parts are on a different day than the main event, it's helpfull to show full date. Sould this be automated?
	displayLongDateTime: t.boolean().notNull().default(false),
})
