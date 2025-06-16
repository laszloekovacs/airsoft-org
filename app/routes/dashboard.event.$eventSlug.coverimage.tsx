import { data, useActionData, useFetcher } from "react-router";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/dashboard.event.$eventSlug.coverimage";

type ActionResult = {
    status: "success" | "failure",
    path: string
}

export const loader = () => {
    return {}
}


export default function CoverImageSelectPage() {
    const fetcher = useFetcher()


    return (
        <div>
            <h1>Borítókép</h1>
            <p>válassz borítóképet az eseményhez</p>

            <fetcher.Form method="POST" encType="multipart/form-data">
                <Input type="file" accept="image" name="image" />
                <Input type="submit" name="submit" value="upload" />
            </fetcher.Form>

            <div>
                {fetcher.data ? (<p>{fetcher.data.status}</p>) : null}
            </div>
        </div>
    )
}


export const action = async ({ request, params }: Route.ActionArgs) => {
    const formData = await request.formData();
    const file = formData.get("image");

    // narrow type to file
    if (!file || typeof file === "string") {
        throw data("No file uploaded", { status: 400 });
    }


    // store it in public/uploads/year/month/user-slug.jpg
    const now = new Date()
    const username = "mike"

    const path = `./public/uploads/${now.getFullYear()}/${now.getMonth()}/${username}-${params.eventSlug}.jpg`


    const writtenBytes = await Bun.write(path, file, {
        createPath: true
    })

    // confirm bytes have been written
    if (file.size != writtenBytes) {
        throw data("failed to write file to disc", { status: 400 })
    }

    // file is now a File or Blob object
    console.log("file uploaded", file.name)

    return {
        status: "success",
        path
    }
}