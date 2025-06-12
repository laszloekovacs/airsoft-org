import { Form, useFetcher } from "react-router";
import { Input } from "~/components/ui/input";


export default function CoverImageSelectPage() {
    const fetcher = useFetcher()

    return (
        <div>
            <h1>Borítókép</h1>
            <p>válassz borítóképet az eseményhez</p>

            <fetcher.Form method="POST">
                <Input type="file" accept="image" name="image" />

            </fetcher.Form>
        </div>
    )
}