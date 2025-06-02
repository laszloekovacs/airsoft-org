import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Input } from "~/components/ui/input"
import { authClient } from "~/services/auth.client"

export default function LoginPage() {
	const navigate = useNavigate()
	const [formError, setFormError] = useState<string>("")

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log("logging in")
		const formData = new FormData(event.currentTarget)

		const email = formData.get("email")?.toString()
		const password = formData.get("password")?.toString()

		console.log(email, password)

		if (!email || !password) {
			setFormError("hibás email vagy jelszó")
			return
		}

		const { data, error } = await authClient.signIn.email({ email, password })

		console.log(error, data)
		if (error?.status) {
			setFormError(error.statusText)
		} else {
			navigate("/")
		}
	}

	return (
		<div className="max-w-lg mx-auto flex flex-col justify-center min-h-screen">
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

				{formError && <p>{formError}</p>}
				<hr />
			</form>

			<div>
				<p>még nincs fiókod?</p>
				<Link to="/signup" className="underline">regisztrálj email-el</Link>
			</div>
		</div>
	)
}
