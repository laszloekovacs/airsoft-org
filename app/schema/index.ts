import { date, integer, pgTable, text, unique } from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

/**
 * Event information table
 */
export const eventRecordTable = pgTable("event_record", {
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
			.references(() => eventRecordTable.id, { onDelete: "set null" }),
		createdAt: date("created_at")
			.notNull()
			.$default(() => new Date().toISOString()),
		group: text("group").notNull().default(""),
	},
	/* user allowed only once to apply for a single event */
	(table) => [unique().on(table.eventId, table.userId)],
)

/**
 * Description of a faction in a game
 */
export const factionInfoTable = pgTable(
	"faction_info",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		eventId: integer("eventId").notNull().references(()=> eventRecordTable.id, {onDelete: "cascade"}),
		title: text().notNull()
	},
	/* factions are uniqe inside one game */
	(table) => [unique().on(table.eventId, table.title)]
)

/*
* Describes how users are allocated int factions at a game. allows multiple roles when 
* multiple games are played: eg: player can be attacker in one game, and a hostage in the next round 
* in the same event day but different scenario.
*/
export const factionAssignmentTable = pgTable("users_in_factions",{

})