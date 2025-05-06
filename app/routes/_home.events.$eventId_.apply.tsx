import { useFetcher } from 'react-router'
import type { Route } from './+types/_home.events.$eventId_.apply'

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
	return {
		status: 'success',
		message: 'Sikeres jelentkezés!'
	}
}
