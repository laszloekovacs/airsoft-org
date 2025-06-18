import { Form, useActionData, type ActionFunctionArgs } from "react-router";
import { z } from "zod/v4";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/dashboard.event.$eventSlug.timetable"


const schema = z.object({
    label: z.string().min(3).max(128),
    timestamp: z.string()
})


export default function TimetablePage() {

    const lastResult = useActionData<typeof action>()
    console.log(lastResult)

    const flattened = lastResult && !lastResult?.success ? z.prettifyError(lastResult.error) : null;
    console.log(flattened)

    return (
        <div>
            <h1>Dátumok és időpontok</h1>

            <Form method="post" >

                <label>date</label>
                <Input type="text" name="timestamp" />


                <label>label</label>
                <Input type="text" name="label" />


                <Button type="submit">rogzit</Button>
            </Form>

        </div>
    )
}


export async function action({ request }: Route.ActionArgs) {

    const formData = await request.formData()
    const submission = schema.safeParse(Object.fromEntries(formData))


    return submission
}