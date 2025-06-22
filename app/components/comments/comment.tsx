

type PostProps = {
    content: string,
}

export const Comment = (props: PostProps) => {
    const { content } = props

    return (
        <li className="p-2">
            <p>{content}</p>
        </li>
    )
}
