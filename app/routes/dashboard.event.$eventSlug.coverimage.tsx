import { Form, useFetcher } from "react-router";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/dashboard.event.$eventSlug.coverimage"



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
        </div>
    )
}


export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
        throw new Response("No file uploaded", { status: 400 });
    }

    // file is now a File or Blob object
    console.log("file uploaded", file.name)

    // store it in public/uploads/year/month/user-uuid
    const now = new Date()
    const username = "mike"

    const basePath = `/public/uploads/${now.getFullYear()}/${now.getMonth()}/${username}-uuid`

    await Bun.write(basePath, file)
}