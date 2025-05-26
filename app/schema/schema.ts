import { eq, sql } from "drizzle-orm"
import {
	boolean,
	date,
	integer,
	pgTable,
	pgView,
	text,
	unique,
} from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

/**
 * Event information
 */
export const eventRecord = pgTable("event_record", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	title: text("name").notNull(),
	date: date("date").notNull(),
	slug: text("slug").notNull().unique(),
	createdAt: date("created_at")
		.notNull()
		.$default(() => new Date().toISOString()),
})

/*
 * user attendance on event many-to-many
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
			.references(() => eventRecord.id, { onDelete: "set null" }),
		createdAt: date("created_at")
			.notNull()
			.$default(() => new Date().toISOString()),
		isConfirmed: boolean("is_confirmed").notNull().default(false),
	},
	(table) => [unique().on(table.eventId, table.userId)],
)

/*
 * join the users details with the user at event table for convinience
 */
export const userAtEventView = pgView("user_at_event_view").as((qb) =>
	qb
		.select({
			id: userAtEventTable.id,
			eventId: userAtEventTable.eventId,
			slug: eventRecord.slug,
			userId: sql`${user.id}`.as("user_id"),
			userName: sql`${user.name}`.as("user_name"),
			isConfirmed: userAtEventTable.isConfirmed,
		})
		.from(userAtEventTable)
		.leftJoin(user, eq(user.id, userAtEventTable.userId))
		.leftJoin(eventRecord, eq(eventRecord.id, userAtEventTable.eventId)),
)
