import type { InferSelectModel } from "drizzle-orm"
import type { factionInfoTable } from "~/schema"
import { Ellipsis, Trash } from "lucide-react"

type FactionCardProps = {
    onDelete?: () => void,
} & InferSelectModel<typeof factionInfoTable>


export const FactionCard = (props: FactionCardProps) => {
    const { name, description, expectedParticipants, image } = props

    return (
        <li className="p-4 flex flex-row space-x-4">
            <div className="flex flex-row">
                {image && <img src={image ?? undefined} alt={name} />}
                <p>{name}</p>
            </div>
            <div className="flex flex-row">
                <div>
                    <p>{description}</p>
                    <p>{expectedParticipants}</p>
                </div>

                <Ellipsis className="w-4 h-4" />
            </div>
        </li>
    )
}