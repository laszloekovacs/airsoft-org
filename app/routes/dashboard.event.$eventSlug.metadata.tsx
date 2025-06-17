import { Label } from "@radix-ui/react-label"
import { useFetcher } from "react-router"
import { Input } from "~/components/ui/input"


export default function MetadataPage() {
    const fetcher = useFetcher()


    return (<div>
        <h1>Metaadatok</h1>

        <fetcher.Form>
            <Label htmlFor="isPrivate">Privát esemény</Label>
            <input type="checkbox" name="isPrivate" />
            <p>Az eseményed nem fog listázásra kerülni, csak linken keresztül lehet megtekinteni</p>

            <Label htmlFor="isOffsite">Linkelt esemény</Label>
            <input type="checkbox" name="isOffsite" />
            <p>az eseményt egy másik oldalon szervezed</p>

            <Input type="text" name="offsiteLink" />
            <p>url a külső esemény oldalhoz</p>


        </fetcher.Form>


    </div>)
}