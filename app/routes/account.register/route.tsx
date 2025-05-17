import { useState } from 'react'
import { authClient } from '~/services/auth.client'
import { authServer } from '~/services/auth.server'
import type { Route } from './+types/route'
import styles from './register.module.css'
import { Link } from 'react-router'

export default function AccountPage({ loaderData }: Route.ComponentProps) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<any>({})
	const [data, setData] = useState<any>({})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { data, error } = await authClient.signUp.email(
			{
				email,
				password,
				name: email,
				image: 'https://picsum.photos/200/200',
				callbackURL: '/'
			},
			{
				onSuccess: ctx => {
					console.log('onSuccess', ctx)
				},
				onError: ctx => {
					console.log('onError', ctx)
				}
			}
		)

		setError(error)
		setData(data)
	}

	return (
		<div className={styles.container}>
			<div className={styles.heading}>
				<div>
					<h1>Airsoft Naptár</h1>
					<Link to='/'>vissza a főoldalra</Link>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.logincard}>
					<h2>Felíratkozás email fiókal</h2>
					<form onSubmit={handleSubmit}>
						<fieldset>
							<label htmlFor='email'>email</label>
							<input
								className='input'
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								autoComplete='email'
							/>
						</fieldset>
						<fieldset>
							<label htmlFor='password'>jelszó</label>
							<input
								className='input'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								autoComplete='new-password'
							/>
						</fieldset>
						<input type='submit' value='regisztrálok' />

						<div>
							<p>
								<span>van már fiókod? &nbsp;</span>
								<Link to='/account/login'>jelentkezz be!</Link>
							</p>
						</div>
						<div className={styles.alert}>
							<h3>figyu!</h3>
							<p>email fiókkal való regsztrálás csak ideiglenes!</p>
							<p>Ne használj létező email / jelszavat!</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export async function loader({ request }: Route.LoaderArgs) {
	const sessionData = await authServer.api.getSession(request)
	if (!sessionData) return null
	return sessionData
}
