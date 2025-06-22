import type { Meta, StoryObj } from "@storybook/react-vite"
import "../app/tailwind.css"
import "../app/styles.css"
import { Comment } from "../app/components/comments/comment"


const meta = {
    title: "Components/Comment",
    component: Comment,
} satisfies Meta<typeof Comment>

export default meta

export const CommentStory: StoryObj<typeof meta> = {
    args: {
        content: "hello worlrd"
    },
}
