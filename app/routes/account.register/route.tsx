import { useState } from 'react'
import { Link } from 'react-router'
import { authClient } from '~/services/auth.client'
import styles from './register.module.css'
import { z } from 'zod'

export default function AccountPage() {
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState<string>('')

	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState<string>('')

	const validateEmail = () => {
		const emailValidation = z
			.string()
			.email({ message: 'hibás email' })
			.safeParse(email)

		if (emailValidation.success) {
			setEmailError('')
		} else {
			setEmailError(emailValidation.error.format()._errors[0])
		}
	}

	const validatePassword = () => {
		const passwordValidation = z
			.string()
			.min(4, { message: 'legalább 4 karakter kell hogy legyen' })
			.safeParse(password)

		if (passwordValidation.success) {
			setPasswordError('')
		} else {
			setPasswordError(passwordValidation.error.format()._errors[0])
		}
	}

	/* handle form submission */
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
	}

	/**
	 * submit button is disabled when
	 * theres an empty field
	 * a field has an error
	 * submitting
	 */

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
								autoComplete='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								onBlur={e => validateEmail()}
							/>
							{emailError && <p>{emailError}</p>}
						</fieldset>
						<fieldset>
							<label htmlFor='password'>jelszó</label>
							<input
								className='input'
								type='password'
								autoComplete='new-password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								onBlur={e => validatePassword()}
							/>
							{passwordError && <p>{passwordError}</p>}
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
