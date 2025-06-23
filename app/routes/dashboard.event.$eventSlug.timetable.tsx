import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { and, eq } from "drizzle-orm"
import { Form, useActionData } from "react-router"
import { z } from "zod/v4"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import * as d from "~/schema"
import { AuthorizedOnly } from "~/services/auth.server"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug.timetable"

const schema = z.object({
    timestamp: z.iso.datetime({ local: true }),
    label: z.string().min(3).max(128),
})

type Schema = z.infer<typeof schema>

// TODO: move this to services?
z.config(z.locales.hu())


export const loader = async ({ request, params }: Route.LoaderArgs) => {

    const [event] = await database.select().from(d.eventsTable).where(eq(d.eventsTable.slug, params.eventSlug))
    const timetable = await database.select().from(d.eventScheduleTable).where(eq(d.eventScheduleTable.eventId, event.id))

    return { timetable }
}


export default function TimetablePage({ loaderData }: Route.ComponentProps) {
    const lastResult = useActionData<typeof action>()
    const { timetable } = loaderData

    const [form, fields] = useForm<Schema>({
        lastResult,
        constraint: getZodConstraint(schema),
    })

    return (
        <div>
            <h1>Dátumok és időpontok</h1>

            <Form method="post" {...getFormProps(form)}>
                <div>{form.errors}</div>

                <label>date</label>
                <Input
                    {...getInputProps(fields.timestamp, { type: "datetime-local" })}
                />
                <div>{fields.timestamp.errors}</div>

                <label>label</label>
                <Input {...getInputProps(fields.label, { type: "text" })} />
                <div>{fields.label.errors}</div>

                <Button type="submit">rogzit</Button>
            </Form>

            <div>
                <h2>idopontok</h2>
                <ul>
                    {timetable.map((item) => {
                        return <li key={item.id}>
                            <p>{item.label}</p>
                            <time>{item.timestamp.toISOString()}</time>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema })

    // check if user has permission, owner of the event
    const { user } = await AuthorizedOnly(request, ["organizer"])

    // check if submission is correct?
    if (submission.status != "success") {
        return submission.reply()
    }


    // if slug and owner match user can edit event
    const [event] = await database
        .select()
        .from(d.eventsTable)
        .where(
            and(
                eq(d.eventsTable.slug, params.eventSlug),
                eq(d.eventsTable.ownerId, user.id),
            ),
        )

    if (!event)
        throw new Response(
            "nincs ilyen esemény, vagy nincs jogosultságod szerkesztéshez",
            { status: 500 },
        )

    const { label, timestamp } = submission.value

    // insert a new time / label into timetable
    const [result] = await database.insert(d.eventScheduleTable).values({
        eventId: event.id,
        label,
        timestamp: new Date(timestamp)
    }).returning()

    if (!result) {
        throw new Error("nem sikerult letrehozni az idopontot")
    }

    return submission.reply()
}
