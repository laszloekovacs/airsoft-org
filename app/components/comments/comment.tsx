import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { useState } from "react"


type PostProps = {
    content: string,
    avatar?: string,
    username?: string,
    onReply?: (text: string) => void,
}

export const Comment = (props: PostProps) => {
    const { content, avatar, username, onReply } = props

    return (
        <div className="p-2">
            <div>
                <div className="flex flex-row gap-2 items-center">
                    <img src={avatar} alt={username} className="h-4 w-4 rounded-full" />
                    <p>{username}</p>
                </div>
                <p>{content}</p>
                <Disclosure>
                    <DisclosureButton>
                        <p>valaszlok</p>
                    </DisclosureButton>
                    <DisclosurePanel>
                        <ReplyForm onReply={onReply} />
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>
    )
}

export const ReplyForm = ({ onReply }: { onReply?: (text: string) => void }) => {
    const [text, setText] = useState<string>()

    const postReply = () => {
        if (text && onReply) {
            onReply(text)
        }
    }

    return (
        <div className="flex flex-row">
            <textarea className="border w-full" onChange={e => setText(e.target.value)} ></textarea>
            <button type="submit" onClick={postReply}>hozzaszolok</button>
        </div>
    )
}