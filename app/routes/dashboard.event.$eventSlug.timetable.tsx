import { Form, useActionData, type ActionFunctionArgs } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import type { Route } from "./+types/dashboard.event.$eventSlug.timetable"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { z } from "zod/v4"
import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { AuthorizedOnly } from "~/services/auth.server"
import database from "~/services/db.server"
import { eventRecordTable, timelineTable } from "~/schema"
import { eq, and } from "drizzle-orm"

const schema = z.object({
    timestamp: z.iso.datetime({ local: true }),
    label: z.string().min(3).max(128),
})

// TODO: move this to services?
z.config(z.locales.hu())

export default function TimetablePage() {
    const lastResult = useActionData<typeof action>()
    const [form, fields] = useForm({
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
        </div>
    )
}

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema })

    // check if user has permission, owner of the event
    const { user } = await AuthorizedOnly(request, ["organizer"])

    // check if submission is correct?
    if (submission.status == "error") {
        return submission.reply()
    }

    // if slug and owner match user can edit event
    const [event] = await database
        .select()
        .from(eventRecordTable)
        .where(
            and(
                eq(eventRecordTable.slug, params.eventSlug),
                eq(eventRecordTable.ownerId, user.id),
            ),
        )

    if (!event)
        throw new Response(
            "nincs ilyen esemény, vagy nincs jogosultságod szerkesztéshez",
            { status: 500 },
        )

    const { label, timestamp } = submission.payload

    console.log(submission)

    // insert a new time / label into timetable
    const result = await database.insert(timelineTable).values({
        eventId: event.id,
        label,
        timestamp: new Date(timestamp.toString())
    })


    return submission.reply()
}
