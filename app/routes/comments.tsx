import { comments } from "~/schema/comments"
import database from "~/services/db.server"
import { and, eq, isNull } from "drizzle-orm"
import type { Route } from "./+types/comments"
import { CommentSection } from "~/components/comments/comment-section"

export const loader = async () => {
    // load all TOP LEVEL (parent == null) comments with a specific entity Id
    // AND the entity id == "test"
    const entity = "be7e59ee-d9ee-4604-ad8a-691da4a1e7a9"

    const threads = await database
        .select()
        .from(comments)
        .where(and(isNull(comments.parentId), eq(comments.entityId, entity)))

    return { threads, entity }
}

export default function CommentsPreview({ loaderData }: Route.ComponentProps) {
    const { threads, entity } = loaderData

    return (
        <div>
            <p>test threads</p>
            <CommentSection threads={threads} />
        </div>
    )
}
