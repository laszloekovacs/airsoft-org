// takes a list of threads
import { comments } from "~/schema/comments"
import type { InferSelectModel } from "drizzle-orm"

type Comment = InferSelectModel<typeof comments>

export const CommentSection = ({ threads }: { threads: Array<Comment> }) => {

    if (threads.length == 0) {
        return <p>nincs megjeleníthető hozzászólás</p>
    }

    return (<div>
        {threads.map((item) => (
            <li key={item.id}>
                <p>{item.content}</p>
            </li>
        ))}
    </div>)
}
