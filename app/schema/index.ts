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
	},
	/* user allowed only once to apply for a single event */
	(table) => [unique().on(table.eventId, table.userId)],
)

/**
 * scenario at an event day. there can be multiple scenarios in one event day
 */
export const scenarioInfoTable = pgTable("scenario_info", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	eventId: integer("event_id").notNull().references(() => eventRecordTable.id, {onDelete: "cascade"}),
	title: text().notNull()
}, 
	(table) => [unique().on(table.eventId, table.title)]
)

/**
 * Description of a faction in a scenario
 */
export const factionInfoTable = pgTable(
	"faction_info",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		scenarioId: integer("scenario_id").references(()=> scenarioInfoTable.id, {onDelete: "cascade"}),
		title: text().notNull()
	},
	/* factions are uniqe inside one game */
	(table) => [unique().on(table.eventId, table.title)]
)

/**
 * associate applicants to roles in a scenario
 */
export const userFactionInScenarioTable = pgTable(
	"user_faction_in_scenario",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		scenarioId: integer().references(()=> scenarioInfoTable.id, {onDelete: "cascade"}),
		factionId: integer().references(()=> factionInfoTable.id, {onDelete:"cascade"}),
		userAtEventId: integer().references(()=> userAtEventTable.id, {onDelete: "cascade"}),
		title: text().notNull()
	},
	(table) => [unique().on(table.factionId, table.userAtEventId)]
)