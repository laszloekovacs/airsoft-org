import { authClient } from '~/services/auth.client'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'

export default function LoginPage() {
	const navigate = useNavigate()
	const [formError, setFormError] = useState<string>('')

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log('logging in')
		const formData = new FormData(event.currentTarget)

		const email = formData.get('email')?.toString()
		const password = formData.get('password')?.toString()

		console.log(email, password)

		if (!email || !password) {
			setFormError('hibás email vagy jelszó')
			return
		}

		const { data, error } = await authClient.signIn.email({ email, password })

		console.log(error, data)
		if (error?.status) {
			setFormError(error.statusText)
		} else {
			navigate('/')
		}
	}

	return (
		<div>
			<div>
				<h1>Belépés</h1>

				<form
					method='post'
					onSubmit={handleSubmit}
					noValidate
					autoComplete='off'>
					<fieldset>
						<label htmlFor='email'>email</label>
						<input className='input' type='email' name='email' autoFocus />
					</fieldset>
					<fieldset>
						<label htmlFor='password'>password</label>
						<input className='input' type='password' name='password' />
					</fieldset>
					<input type='submit' value='Belépés' data-umami-event='login' />

					{formError && <p>{formError}</p>}
					<hr />
				</form>
				<div>
					<button disabled>facebook</button>
					<button disabled>github</button>
					<button disabled>discord</button>
				</div>
				<div>
					<p>még nincs fiókod?</p>
					<Link to='/account/register'>regisztrálj email-el</Link>
				</div>
			</div>
			<br />
			<hr />
			<div>
				<Link to='/'>vissza a főoldalra</Link>
			</div>
		</div>
	)
}
