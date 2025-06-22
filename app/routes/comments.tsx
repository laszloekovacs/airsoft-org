import { comments } from "~/schema/comments"
import database from "~/services/db.server"
import { and, eq, isNull } from "drizzle-orm"
import type { Route } from "./+types/comments"
import { CommentSection } from "~/components/comments/comment"

export const loader = async () => {
    // load all TOP LEVEL (parent == null) comments with a specific entity Id
    // AND the entity id == "test"
    const entity = "text"

    const threads = await database
        .select()
        .from(comments)
        .where(and(isNull(comments.parentId), eq(comments.entityId, entity)))

    return { threads }
}

export default function CommentsPreview({ loaderData }: Route.ComponentProps) {
    const { threads } = loaderData

    return <div>

        <p>test threads</p>
        <CommentSection threads={threads} />

    </div>
}
