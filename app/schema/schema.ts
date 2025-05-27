import { date, integer, pgTable, text, unique } from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

/**
 * Event information table
 */
export const eventTable = pgTable("event_record", {
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
	groups: text("groups")
		.array()
		.notNull()
		.$default(() => []),
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
			.references(() => eventTable.id, { onDelete: "set null" }),
		createdAt: date("created_at")
			.notNull()
			.$default(() => new Date().toISOString()),
		group: text("group").notNull().default(""),
	},
	(table) => [unique().on(table.eventId, table.userId)],
)
