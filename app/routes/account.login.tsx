import { authClient } from '~/services/auth.client'
import { useNavigate } from 'react-router'

export default function LoginPage() {
	const navigate = useNavigate()

	const handleSubmit = async event => {
		event.preventDefault()

		const email = event.target.username.value
		const password = event.target.password.value

		await authClient.signIn.email({ email, password })

		// redirect
		navigate('/')
	}

	return (
		<div>
			<h1>Belépés</h1>

			<form method='post' onSubmit={handleSubmit}>
				<input type='email' name='mail' placeholder='email' />
				<input type='password' name='password' placeholder='Jelszó' />
				<input type='submit' value='Belépés' />
			</form>
		</div>
	)
}
