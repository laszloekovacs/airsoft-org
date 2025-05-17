import { authClient } from '~/services/auth.client'
import { Link, useNavigate } from 'react-router'
import styles from './login.module.css'

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
		<div className={styles.container}>
			<div className={styles.card}>
				<h1>Belépés</h1>

				<form method='post' onSubmit={handleSubmit}>
					<fieldset>
						<label htmlFor='email'>email</label>
						<input className='input' type='email' name='email' />
					</fieldset>
					<fieldset>
						<label htmlFor='password'>password</label>
						<input
							className='input'
							type='password'
							name='password'
							autoComplete='off'
						/>
					</fieldset>
					<input type='submit' value='Belépés' data-umami-event='login' />

					<hr />
				</form>
				<div className={styles.socials}>
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
