import { Link, useFetcher } from 'react-router'
import { z } from 'zod'

export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	const name = formData.get('name')
	const date = formData.get('date')

	const createEventSchema = z.object({
		name: z.string().min(3, 'legalább 3 karakter hosszú név szükséges'),

		date: z
			.string()
			.date()
			.refine(
				date => {
					const today = new Date()
					const eventDate = new Date(date)
					return eventDate > today
				},
				{ message: 'a jövőbeli dátum szükséges' }
			)
	})

	const parseResult = createEventSchema.safeParse({ name, date })
	console.log('parseResult', parseResult)

	if (!parseResult.success) {
		return {
			errors: parseResult.error.format(),
			data: null
		}
	} else {
		const event = parseResult.data
		return { event }
	}
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
					<pre>{JSON.stringify(fetcher.data, null, 3)}</pre>
				</div>
			)}
		</div>
	)
}
