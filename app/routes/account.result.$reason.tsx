import { Link, useParams } from 'react-router'

export default function AccountActionResult() {
	const params = useParams<string>()

	const signup = (
		<div>
			<h1>Sikeres regisztráció!</h1>
			<Link to='/'>vissza a főoldalra</Link>
		</div>
	)

	switch (params.reason) {
		case 'signup':
			return signup
			break

		default:
			throw new Error('hibás oldal paraméter')
			break
	}
}
