import { useState } from "react"
import { Form, useActionData } from "react-router"
import { Button } from "~/components/ui/button"
import { event_records } from "~/schema"
import { AuthorizedOnly } from "~/services/auth.server"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.description"
import { and, eq } from "drizzle-orm"
import { getInputProps, useForm } from "@conform-to/react"
import { z } from "zod/v4"
import { parseWithZod } from "@conform-to/zod/v4"

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const { user } = await AuthorizedOnly(request, ["organizer"])

    const [event] = await database
        .select()
        .from(event_records)
        .where(
            and(
                eq(event_records.slug, params.eventSlug),
                eq(event_records.ownerId, user.id),
            ),
        )

    if (!event) throw new Error("nincs ilyen esemeny")

    return { description: event.description }
}


const formSchema = z.object({
    description: z.string()
})


export default function DescriptionEditPage({
    loaderData,
}: Route.ComponentProps) {
    const { description } = loaderData

    const [text, setText] = useState<string>(description || "")
    const lastResult = useActionData<typeof action>()

    const [form, fields] = useForm({
        defaultValue: loaderData
    })

    return (
        <div>
            <Form>
                <Button type="submit">Mentes</Button>


                <textarea className="border"
                    {...getInputProps(fields.description, { type: "text" })}
                ></textarea>

            </Form>
        </div>
    )
}


export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema: formSchema })


}