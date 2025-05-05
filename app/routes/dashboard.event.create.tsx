import { Link, useFetcher } from 'react-router'
import { z } from 'zod'
import { generateUrlSafeName } from '~/helpers/generateUrlSafeName'
import mockDatabase from '~/mock/db.server'

export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	const formDataEntries = Object.fromEntries(formData.entries())

	const createEventSchema = z.object({
		name: z.string().min(3, 'legalább 3 karakter hosszú név szükséges'),

		date: z
			.string()
			.date('érvénytelen dátum formátum')
			.refine(
				date => {
					const today = new Date()
					const eventDate = new Date(date)
					return eventDate > today
				},
				{ message: 'a jövőbeli dátum szükséges' }
			),

		generatedUrlName: z
			.string()
			.refine(
				name => {
					const generated = generateUrlSafeName(name)
					return generated === name
				},
				{
					message: 'érvénytelen generált URL név'
				}
			)
			.refine(
				async name => {
					const existingEvents = await mockDatabase.findEventByUrl(name, true)
					return existingEvents.length > 0
				},
				{ message: 'már létezik ilyen nevű esemény' }
			)
	})

	// validate form data submitted by the user
	const parseResult = await createEventSchema.safeParseAsync(formDataEntries)
	console.log('parseResult', parseResult)

	if (parseResult.success) {
		// create event in the database
		const { name, date, generatedUrlName } = parseResult.data
		const event = await mockDatabase.createEvent({
			url: generatedUrlName,
			name,
			date
		})

		return { generatedUrlName: event.url }
	} else {
		return {
			...parseResult.error.format()
		}
	}
}

export default function DashboardEventCreate() {
	const fetcher = useFetcher<typeof action>()

	const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const formDataEntries = Object.fromEntries(formData.entries())

		const generatedUrlName = generateUrlSafeName(
			formDataEntries.date + ' ' + formDataEntries.name
		)

		// add to formData
		formData.append('generatedUrlName', generatedUrlName)

		// post with fetcher
		fetcher.submit(formData, {
			method: 'post'
		})
	}

	return (
		<div>
			<h2>Új esemény létrehozása</h2>

			<fetcher.Form method='post' onSubmit={handleSubmit}>
				<div>
					<label>
						<span>esemény neve</span>
						<input type='text' name='name' id='name' />
					</label>

					<label>
						<span>esemény időpontja</span>
						<input type='date' name='date' id='date' />
					</label>

					<input type='submit' value='létrehozás' />
				</div>
			</fetcher.Form>

			{fetcher.data && (
				<div>
					<pre>{JSON.stringify(fetcher.data, null, 3)}</pre>
				</div>
			)}
		</div>
	)
}
