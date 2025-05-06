import { Temporal } from '@js-temporal/polyfill'
import { Link, useFetcher } from 'react-router'
import { z } from 'zod'
import { generateUrlSafeName } from '~/helpers/generateUrlSafeName'
import db from '~/services/db.server'
import { eventsTable } from '~/db/schema'
import { eq } from 'drizzle-orm'

type ErrorResponseType = {
	state: 'error'
	fieldErrors: {
		[key: string]: string[]
	}
	formErrors: string[]
}

type SuccessResponseType = {
	state: 'success'
	eventUrlSlug: string
}

type ActionResponseType = ErrorResponseType | SuccessResponseType

const generateSlug = (name: string, year: number) => {
	return generateUrlSafeName(year + ' ' + name)
}

export async function action({
	request
}: {
	request: Request
}): Promise<ActionResponseType> {
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
					return today < eventDate
				},
				{ message: 'jövőbeli dátum szükséges' }
			),

		eventUrlSlug: z
			.string()
			.min(3, 'legalább 3 karakter hosszú név szükséges')
			.refine(
				async name => {
					const existingEvents = await db
						.select()
						.from(eventsTable)
						.where(eq(eventsTable.urlSlug, name))

					return existingEvents.length == 0
				},
				{ message: 'már létezik ilyen nevű esemény' }
			)
	})

	// validate form data submitted by the user
	const parseResult = await createEventSchema.safeParseAsync(formDataEntries)

	if (parseResult.success) {
		// create event in the database
		const { name, date, eventUrlSlug } = parseResult.data
		const result = await db.insert(eventsTable).values({
			name,
			date,
			urlSlug: eventUrlSlug
		})

		if (result.rowsAffected == 0) {
			return {
				state: 'error',
				fieldErrors: {},
				formErrors: ['esemény létrehozása sikertelen']
			}
		}

		return {
			state: 'success',
			eventUrlSlug
		}
	} else {
		return {
			state: 'error',
			fieldErrors: parseResult.error.flatten().fieldErrors,
			formErrors: []
		}
	}
}

export default function DashboardEventCreate() {
	const fetcher = useFetcher<typeof action>()

	const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget)
		const formDataEntries = Object.fromEntries(formData.entries())

		event.preventDefault()

		// extract year from date
		const year = new Date(formDataEntries.date.toString()).getFullYear()

		// generate a name for the event
		const eventUrlSlug = generateSlug(formDataEntries.name.toString(), year)

		// add event name to formData
		formData.append('eventUrlSlug', eventUrlSlug)

		// add intent
		formData.append('intent', 'createEvent')

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
					{fetcher.data?.state == 'error' && (
						<FieldValidationErrors errors={fetcher.data.fieldErrors?.name} />
					)}

					<label>
						<span>esemény időpontja</span>
						<input
							type='date'
							name='date'
							id='date'
							defaultValue={Temporal.Now.plainDateISO().toString()}
						/>
					</label>
					{fetcher.data?.state == 'error' && (
						<FieldValidationErrors errors={fetcher.data.fieldErrors?.date} />
					)}

					<input
						type='submit'
						name='intent'
						value='létrehozás'
						disabled={fetcher.state != 'idle'}
					/>
				</div>
			</fetcher.Form>

			{fetcher.data && <pre>{JSON.stringify(fetcher.data, null, 3)}</pre>}

			<div>
				{fetcher.data?.state == 'success' && (
					<CreatedEventEditorLink eventUrlSlug={fetcher.data.eventUrlSlug} />
				)}
			</div>
		</div>
	)
}

const CreatedEventEditorLink = ({ eventUrlSlug }: { eventUrlSlug: string }) => {
	return (
		<div>
			<h2>Esemény létrehozva!</h2>
			<p>{`/dashboard/event/${eventUrlSlug}`}</p>
			<Link to={`/dashboard/event/${eventUrlSlug}`}>
				létrehozott esemény szerkesztése
			</Link>
		</div>
	)
}

const FieldValidationErrors = ({ errors }: { errors?: string[] }) => {
	if (!errors) return null
	if (errors.length === 0) return null

	return (
		<div>
			{errors.map(error => (
				<p key={error}>{error}</p>
			))}
		</div>
	)
}
