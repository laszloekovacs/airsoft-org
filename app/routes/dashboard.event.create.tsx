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
			)
	})

	const parseResult = createEventSchema.safeParse(formDataEntries)

	// TODO: save to db, generate link
	console.log('parseResult', parseResult)

	if (parseResult.success) {
		// generate suggested url for event
		const generatedName = generateUrlSafeName(
			parseResult.data.date + ' ' + parseResult.data.name
		)

		// check if event exists with this name in the database
		const existingEvents = await mockDatabase.findEventByUrl(
			generatedName,
			false
		)

		if (existingEvents.length > 0) {
			return {
				error: 'Esemény már létezik ezzel a névvel',
				suggestedName: generatedName
			}
		}

		// create event in the database

		return { generatedName }
	} else {
		return {
			...parseResult.error.format()
		}
	}
}

export default function DashboardEventCreate() {
	const fetcher = useFetcher<typeof action>()

	return (
		<div>
			<h2>Új esemény létrehozása</h2>

			<fetcher.Form method='post'>
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
