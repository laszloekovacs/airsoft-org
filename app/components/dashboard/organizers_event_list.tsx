import { Link, useNavigate } from "react-router"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

type PropsType = {
    events: {
        startDate: string
        title: string
        slug: string
    }[]
}

export const OrganizersEventList = ({ events }: PropsType) => {
    if (events.length == 0) {
        return (
            <div className="grid place-content-center">
                <p className="text-muted-foreground">nincsenek általad szervezett események</p>
            </div>
        )
    }

    const navigate = useNavigate()

    const handleRowClick = (slug: string) => {
        navigate(`/dashboard/event/${slug}`)
    }

    return (
        <Table>
            <TableCaption>Általad szervezett események</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Dátum</TableHead>
                    <TableHead className="text-left">Esemény</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {events.map((event) => (
                    <TableRow key={event.title}
                        className="cursor-pointer"
                        onClick={() => handleRowClick(event.slug)}>
                        <TableCell className="text-left">
                            {event.startDate}
                        </TableCell>
                        <TableCell>
                            {event.title}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
