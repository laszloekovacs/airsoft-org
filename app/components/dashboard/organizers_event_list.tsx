import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table"


type PropsType = {
    events: {
        date: Date,
        title: string
    }[]
}

export const OrganizersEventList = ({ events }: PropsType) => {

    if (events.length == 0) {
        return <div><p>nincsenek általad szervezett események</p></div>
    }

    return (
        <Table>
            <TableCaption>Általad szervezett események</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        Dátum
                    </TableHead>
                    <TableHead>
                        Esemény
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>

            </TableBody>
        </Table>
    )
}