import {
	integer,
	text,
	pgTable,
	date,
	unique,
	boolean,
	pgView,
	uuid
} from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'
import { user } from './auth-schema'

export const eventRecord = pgTable('eventRecord', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'set null' }),
	title: text('name').notNull(),
	date: date('date').notNull(),
	urlSlug: text('url_slug').notNull().unique(),
	createdAt: date('created_at')
		.notNull()
		.$default(() => new Date().toISOString())
})

export const userAtEventTable = pgTable(
	'userAtEvent',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		eventId: integer('event_id')
			.notNull()
			.references(() => eventRecord.id, { onDelete: 'set null' }),
		createdAt: date('created_at')
			.notNull()
			.$default(() => new Date().toISOString()),
		isConfirmed: boolean('is_confirmed').notNull().default(false)
	},
	table => [unique().on(table.eventId, table.userId)]
)

/*
 * join the users details with the user at event table
 */
export const userAtEventView = pgView('user_at_event_view').as(qb =>
	qb
		.select({
			id: userAtEventTable.id,
			eventId: userAtEventTable.eventId,
			isConfirmed: userAtEventTable.isConfirmed,
			userName: user.name
		})
		.from(userAtEventTable)
		.leftJoin(user, eq(user.id, userAtEventTable.userId))
)
