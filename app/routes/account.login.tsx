import { authClient } from '~/services/auth.client'
import { useNavigate } from 'react-router'

export default function LoginPage() {
	const navigate = useNavigate()

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const email = formData.get('mail')?.toString()
		const password = formData.get('password')?.toString()

		if (!email || !password) {
			return
		}

		const result = await authClient.signIn.email({ email, password })

		result.error && console.log(result.error)
		result.data && console.log(result.data)

		// redirect
		navigate('/')
	}

	return (
		<div>
			<h1>Belépés</h1>

			<form method='post' onSubmit={handleSubmit}>
				<input className='input' type='email' name='mail' placeholder='email' />
				<input
					className='input'
					type='password'
					name='password'
					placeholder='Jelszó'
				/>
				<input className='bg-black text-white' type='submit' value='Belépés' />
			</form>
		</div>
	)
}
