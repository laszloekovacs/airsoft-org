import { uuid, integer, text, pgTable, date, unique } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const eventsTable = pgTable('events', {
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

export const eventAttendeesTable = pgTable(
	'eventAttendees',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		eventId: integer('event_id')
			.notNull()
			.references(() => eventsTable.id, { onDelete: 'set null' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		createdAt: date('created_at')
			.notNull()
			.$default(() => new Date().toISOString())
	},
	table => [unique().on(table.eventId, table.userId)]
)
