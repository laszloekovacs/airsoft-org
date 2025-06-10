import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Input } from "~/components/ui/input"
import { authClient } from "~/services/auth.client"
import { z } from "zod"


export default function LoginPage() {
	const navigate = useNavigate()
	const [formError, setFormError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const formObject = Object.fromEntries(formData)

		const credentials = z.object({
			email: z.string().email(),
			password: z.string()
		}).safeParse(formObject)

		if (credentials.success) {
			const { email, password } = credentials.data

			const authResult = await authClient.signIn.email({
				email, password
			})

			if (!authResult.error) {
				navigate("/")
			}

			setFormError("error loggin in")
		} else {
			setFormError("badly formatted form data")
		}
	}

	return (
		<div className="max-w-lg mx-auto flex flex-col justify-center min-h-dvh">
			<h1 className="text-xl">Belépés</h1>
			<Link to="/" className="underline">vissza a főoldalra</Link>
			<br />

			<form method="post" onSubmit={handleSubmit} noValidate autoComplete="off">
				<fieldset>
					<label htmlFor="email">email</label>
					<Input className="input" type="email" name="email" />
				</fieldset>
				<fieldset>
					<label htmlFor="password">password</label>
					<Input className="input" type="password" name="password" />
				</fieldset>
				<Input type="submit" value="Belépés" data-umami-event="login" />

				{formError && <p className="text-red-800 py-2">{formError}</p>}
				<hr />
			</form>

			<div>
				<p>még nincs fiókod?</p>
				<Link to="/signup" className="underline">regisztrálj email-el</Link>
			</div>
		</div>
	)
}
