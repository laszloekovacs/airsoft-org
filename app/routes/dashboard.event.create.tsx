import { Form, Link, useActionData, useFetcher } from 'react-router'
import { z } from 'zod'


export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	const name = formData.get('name')
	const date = formData.get('date')


	const createEventSchema = z.object({
		name: z.string().length(3, 'legalább 3 karakter hosszú név szükséges'),

		date: z
			.date({
				required_error: 'az esemény időpontja kötelező',
				invalid_type_error: 'az esemény időpontja nem megfelelő formátumú'
			})
			.min(new Date(), 'az esemény időpontja nem lehet a múltban')
	})

	const parseResult = createEventSchema.safeParse({ name, date })
	return parseResult
}


export default function DashboardEventCreate() {
	const fetcher = useFetcher<typeof action>()

	return (
		<div>
			<h1>Új esemény létrehozása</h1>

			<fetcher.Form method='post'>
				<label htmlFor='name'>esemény neve</label>
				<input type='text' name='name' id='name' required />

				<label htmlFor='date'>esemény időpontja</label>
				<input type='date' name='date' id='date' required />

				<input type='submit' value='létrehozás' />
			</fetcher.Form>

			{fetcher.data && (
				<div>
					<h2>uj esemeny letrehozva</h2>
					<p>esemeny neve: {fetcher.data.}</p>
					<p>esemeny idopontja: {fetcher.data.date}</p>
					<Link to={`/dashboard/event/${fetcher.data.name}`}>
						létrehozott esemény szerkesztése
					</Link>
				</div>
			)}
		</div>
	)
}
