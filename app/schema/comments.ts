import * as t from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

export const comments = t.pgTable(
	"comments",
	{
		id: t.uuid("id").primaryKey().defaultRandom(),

		// the comment
		content: t.text("content").notNull(),

		// the poster
		userId: t.text("user_id").references(() => user.id),

		// entity id that references anything that can be commented on
		entityId: t.uuid("entity_id").notNull(),

		// the parent, null if this is a top level comment
		threadId: t.uuid("thread_id"),

		createdAt: t.timestamp("created_at").defaultNow(),

		// allow for soft deletion
		deletedAt: t.timestamp("deleted_at"),

		// TODO: add metadata like reactions
	},
	(table) => [
		t.foreignKey({
			columns: [table.threadId],
			foreignColumns: [table.id],
			name: "thread_id_fk",
		}),
	],
)
