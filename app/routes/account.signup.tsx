import { useState } from 'react'
import { authClient } from '~/services/auth.client'
import { authServer } from '~/services/auth.server'
import type { Route } from './+types/account.signup'

export default function AccountPage({ loaderData }: Route.ComponentProps) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		e.stopPropagation()

		const { data, error } = await authClient.signUp.email(
			{
				email,
				password,
				name: password,
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
	}

	return (
		<div>
			<h2>Account management</h2>
			<form onSubmit={handleSubmit}>
				<p>create</p>
				<input
					className='input_email'
					type='email'
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					className='input_password'
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<input type='submit' value='Create account' />
			</form>

			<div>
				<pre>{JSON.stringify(loaderData, null, 2)}</pre>
			</div>
			<img src={loaderData?.user?.image ?? ''} />
		</div>
	)
}

export async function loader({ request }: Route.LoaderArgs) {
	const sessionData = await authServer.api.getSession(request)
	if (!sessionData) return null
	return sessionData
}
