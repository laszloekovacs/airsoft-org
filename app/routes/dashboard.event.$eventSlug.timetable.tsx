import { Form, useActionData, type ActionFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/dashboard.event.$eventSlug.timetable"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { z } from "zod/v4";
import { getFormProps, getInputProps, useForm } from "@conform-to/react"


const schema = z.object({
    label: z.string().min(3).max(128),
    timestamp: z.iso.datetime()
})

// TODO: move this to services?
z.config(z.locales.hu())

export default function TimetablePage() {
    const lastResult = useActionData<typeof action>()
    const [form, fields] = useForm({ lastResult, constraint: getZodConstraint(schema) })

    return (
        <div>
            <h1>Dátumok és időpontok</h1>

            <Form method="post" {...getFormProps(form)}>
                <div>{form.errors}</div>

                <label>date</label>
                <Input {...getInputProps(fields.timestamp, { type: "datetime-local" })} />
                <div>{fields.timestamp.errors}</div>

                <label>label</label>
                <Input {...getInputProps(fields.timestamp, { type: "text" })} />
                <div>{fields.label.errors}</div>

                <Button type="submit">rogzit</Button>
            </Form>

        </div>
    )
}


export async function action({ request }: Route.ActionArgs) {

    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema })


    return submission.reply()
}