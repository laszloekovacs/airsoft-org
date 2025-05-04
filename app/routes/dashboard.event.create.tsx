import { Form, Link, useActionData } from 'react-router'

export default function DashboardEventCreate() {
	const data = useActionData()

	return (
		<div>
			<h1>uj esemeny letrehozasa</h1>

			<Form method='post'>
				<label htmlFor='name'>esemeny neve</label>
				<input type='text' name='name' id='name' required />
				<label htmlFor='date'>esemeny idopontja</label>
				<input type='date' name='date' id='date' required />
				<input type='submit' value='letrehozas' />
			</Form>

			{data && (
				<div>
					<p>{data.name} nevu esemeny letrehozva!</p>
					<Link to={`/dashboard/event/${data.name}`}>esemeny szerkesztese</Link>
				</div>
			)}
		</div>
	)
}

// should return a generated event link, or an error message
export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	const name = formData.get('name')
	const date = formData.get('date')

	// TODO: validate name and date
	// return error if already exists

	return { name, date } // TODO: return generated event link
}
