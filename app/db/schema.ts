import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique()
})

export const eventsTable = sqliteTable('events', {
	id: int('id').primaryKey({ autoIncrement: true }),
	title: text('name').notNull(),
	date: text('date').notNull(),
	urlSlug: text('url_slug').notNull().unique(),
	createdAt: text('created_at')
		.notNull()
		.$default(() => new Date().toISOString())
})
