import type { InferSelectModel } from "drizzle-orm"
import type { eventFaction } from "~/schema"
import { Ellipsis } from "lucide-react"

type FactionCardProps = {
    onDelete?: () => void
} & InferSelectModel<typeof eventFaction>

export const FactionCard = (props: FactionCardProps) => {
    const { name, description, expectedParticipants } = props

    return (
        <li className="p-4 flex flex-row space-x-4">
            <h2>{name}</h2>

            <p>{expectedParticipants}</p>
            <p>{description}</p>

            <Ellipsis className="w-4 h-4" />
        </li>
    )
}
