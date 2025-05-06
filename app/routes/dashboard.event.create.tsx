import { Link, useFetcher } from 'react-router'
import { z } from 'zod'
import { generateUrlSafeName } from '~/helpers/generateUrlSafeName'
import mockDatabase from '~/mock/db.server'

type ErrorResponseType = {
	state: 'error'
	fieldErrors: {
		[key: string]: string[]
	}
}

type SuccessResponseType = {
	state: 'success'
	generatedUrlName: string
}

type FormActionResponseType = ErrorResponseType | SuccessResponseType

export async function action({
	request
}: {
	request: Request
}): Promise<FormActionResponseType> {
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
				{ message: 'jövőbeli dátum szükséges' }
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

	if (parseResult.success) {
		// create event in the database
		const { name, date, generatedUrlName } = parseResult.data
		await mockDatabase.createEvent({
			url: generatedUrlName,
			name,
			date
		})

		return {
			state: 'success',
			generatedUrlName
		}
	} else {
		return {
			state: 'error',
			fieldErrors: parseResult.error.flatten().fieldErrors
		}
	}
}

export default function DashboardEventCreate() {
	const fetcher = useFetcher<typeof action>()

	const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const formDataEntries = Object.fromEntries(formData.entries())

		const generatedUrlName = generateUrlSafeName(
			formDataEntries.date + ' ' + formDataEntries.name
		)

		// add to formData
		formData.append('generatedUrlName', generatedUrlName)

		// post with fetcher
		await fetcher.submit(formData, {
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
						<input type='date' name='date' id='date' />
					</label>
					{fetcher.data?.state == 'error' && (
						<FieldValidationErrors errors={fetcher.data.fieldErrors?.date} />
					)}

					<input
						type='submit'
						value='létrehozás'
						disabled={fetcher.state != 'idle'}
					/>
				</div>
			</fetcher.Form>

			{fetcher.data && <pre>{JSON.stringify(fetcher.data, null, 3)}</pre>}

			<div>
				{fetcher.data?.state == 'success' && (
					<CreatedEventEditorLink
						generatedUrlName={fetcher.data.generatedUrlName}
					/>
				)}
			</div>
		</div>
	)
}

const CreatedEventEditorLink = ({
	generatedUrlName
}: {
	generatedUrlName: string
}) => {
	const url = `/dashboard/event/${generatedUrlName}`

	return (
		<div>
			<h2>Esemény létrehozva!</h2>
			<p>{generatedUrlName}</p>
			<Link to={url}>létrehozott esemény szerkesztése</Link>
		</div>
	)
}

const FieldValidationErrors = ({ errors }: { errors?: string[] }) => {
	if (!errors) return null

	return (
		<div>
			{errors.map(error => (
				<p key={error}>{error}</p>
			))}
		</div>
	)
}
