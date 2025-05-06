import { useFetcher } from 'react-router'

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

export async function action() {}
