// takes a list of threads
import { comments } from "~/schema/comments"
import type { InferSelectModel } from "drizzle-orm"
import { Comment } from "./comment"


type CommentRecordType = InferSelectModel<typeof comments>

type CommentSectionProps = {
    threads: Array<CommentRecordType>
    onSubmit?: () => void
}

// container for comments
export const CommentSection = (props: CommentSectionProps) => {
    const { threads, onSubmit } = props

    if (threads.length == 0) {
        return <p>nincs megjeleníthető hozzászólás</p>
    }

    return (
        <ul>
            {threads.map((item) => (
                <Comment key={item.id} content={item.content} />
            ))}
        </ul>
    )
}

