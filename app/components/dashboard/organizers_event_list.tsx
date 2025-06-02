import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table"


export const OrganizersEventList = () => {

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