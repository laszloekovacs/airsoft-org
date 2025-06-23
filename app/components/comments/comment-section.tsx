// takes a list of threads
import { commentsTable } from "~/schema/comments"
import type { InferSelectModel } from "drizzle-orm"
import { Comment } from "./comment"


type CommentRecordType = InferSelectModel<typeof commentsTable>

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
                <li key={item.id}>
                    <Comment content={item.content} />
                </li>
            ))}
        </ul>
    )
}

