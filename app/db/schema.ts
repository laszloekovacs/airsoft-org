import { int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { user } from './auth-schema'

export const eventsTable = sqliteTable('events', {
	id: int('id').primaryKey({ autoIncrement: true }),
	title: text('name').notNull(),
	date: text('date').notNull(),
	urlSlug: text('url_slug').notNull().unique(),
	createdAt: text('created_at')
		.notNull()
		.$default(() => new Date().toISOString())
})

export const applicationsTable = sqliteTable(
	'applications',
	{
		id: int('id').primaryKey({ autoIncrement: true }),
		eventId: int('event_id')
			.notNull()
			.references(() => eventsTable.id, { onDelete: 'set null' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		createdAt: text('created_at')
			.notNull()
			.$default(() => new Date().toISOString())
	},
	table => [unique().on(table.eventId, table.userId)]
)
