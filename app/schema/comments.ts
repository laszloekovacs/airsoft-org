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

		// this comment is part of this discussion
		discussionId: t.uuid("discussion_id").references(() => discussions.id),

		// the parent, null if this is a top level comment
		parentId: t.uuid("parent_id"),

		createdAt: t.timestamp("created_at").defaultNow(),

		// allow for soft deletion
		deletedAt: t.timestamp("deleted_at"),

		// TODO: add metadata like reactions
	},
	(table) => [
		t.foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "thread_id_fk",
		}),
	],
)

// discussion referencing an event or anything
// that can have a discussion. reference this in events, etc.
export const discussions = t.pgTable("discussions", {
	id: t.uuid().primaryKey().defaultRandom(),
})
