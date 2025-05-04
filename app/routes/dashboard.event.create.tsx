import { Form, useActionData } from 'react-router'

export default function DashboardEventCreate() {
	// read action data
	const data = useActionData()

	return (
		<div>
			<h1>uj esemeny letrehozasa</h1>

			<Form method='post'>
				<label htmlFor='name'>esemeny neve</label>
				<input type='text' name='name' id='name' required />

				<input type='submit' value='letrehozas' />
			</Form>

			{data && (
				<div>
					<p>{data.name} nevu esemeny letrehozva!</p>
				</div>
			)}
		</div>
	)
}

export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	const name = formData.get('name')
	const event = { name }
	console.log('uj esemeny letrehozva', event)
	return event
}
