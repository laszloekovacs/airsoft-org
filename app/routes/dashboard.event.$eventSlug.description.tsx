import { useState } from "react"
import { Form } from "react-router"
import { Button } from "~/components/ui/button"
import { event_records } from "~/schema"
import { AuthorizedOnly } from "~/services/auth.server"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.description"
import { and, eq } from "drizzle-orm"

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


export default function DescriptionEditPage({
    loaderData,
}: Route.ComponentProps) {
    const { description } = loaderData

    const [text, setText] = useState<string>(description || "")

    return (
        <div>
            <Form>
                <Button type="submit">Mentes</Button>


                <textarea className="border"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>

            </Form>
        </div>
    )
}
