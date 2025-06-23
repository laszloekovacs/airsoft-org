import type { Meta, StoryObj } from "@storybook/react-vite"
import { Comment } from "../app/components/comments/comment"
import "../app/styles.css"
import "../app/tailwind.css"

const meta = {
    title: "Components/Comment",
    component: Comment,
} satisfies Meta<typeof Comment>

export default meta

export const CommentStory: StoryObj<typeof meta> = {
    args: {
        content: "hello worlrd",
        avatar: "https://picsum.photos/18/18",
        username: "anon",
    },
}
