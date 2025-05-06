import { useFetcher } from 'react-router'
import type { Route } from './+types/_home.events.$eventId_.apply'

export const loader = async () => {
	// TODO: only for logged in

	return {}
}

export default function ApplyEventPage() {
	const fetcher = useFetcher()

	return (
		<div>
			<h2>Jelentkezes jatekra</h2>
			<p>feltetelek itt</p>

			<fetcher.Form method='post'>
				<label>
					<span>elfogadom a felteteleket</span>
					<input type='checkbox' name='acceptTerms' id='acceptTerms'></input>
				</label>
				<br />
				<input type='hidden' name='intent' value='apply' />
				<input type='submit' value='Jelentkezek' />
			</fetcher.Form>
		</div>
	)
}

type ErrorResponse = {
	status: 'error'
	reason: string
}

type SuccessResponse = {
	status: 'success'
	message: string
}

type ActionResponse = ErrorResponse | SuccessResponse

export async function action({
	request
}: Route.ActionArgs): Promise<ActionResponse> {
	const formData = await request.formData()
	const formEntries = Object.fromEntries(formData.entries())

	return {
		status: 'success',
		message: 'Sikeres jelentkezés!'
	}
}
