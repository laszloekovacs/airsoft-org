import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authClient } from "~/services/auth.client";

import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const MIN_PASSWORD = 8;

export default function AccountPage() {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<string>("");

	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string>("");

	const [formError, setFormError] = useState<string>();

	const navigate = useNavigate();

	const validateEmail = () => {
		const emailValidation = z
			.string()
			.email({ message: "hibás email" })
			.safeParse(email.trim());

		if (emailValidation.success) {
			setEmailError("");
		} else {
			setEmailError(emailValidation.error.format()._errors[0]);
		}
	};

	const validatePassword = () => {
		const passwordValidation = z
			.string()
			.min(MIN_PASSWORD, {
				message: `legalább ${MIN_PASSWORD} karakter kell hogy legyen`,
			})
			.safeParse(password.trim());

		if (passwordValidation.success) {
			setPasswordError("");
		} else {
			setPasswordError(passwordValidation.error.format()._errors[0]);
		}
	};

	/* handle form submission */
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		/* submit might happen before blur, revalidate */
		validateEmail();
		validatePassword();

		if (emailError.length || passwordError.length) {
			return;
		}

		/* better auth signup will log you in automatically */
		const { data, error } = await authClient.signUp.email(
			{
				email,
				password,
				name: email,
				image: "https://picsum.photos/200/200",
			},
			{
				onError: (ctx) => {
					if (ctx.error.code == "USER_ALREADY_EXISTS") {
						setFormError("ez az email már regisztrálva van!");
					} else {
						setFormError(ctx.error.message);
					}
				},
				onSuccess: (ctx) => {
					navigate("/result/signup");
				},
			},
		);
	};

	/**
	 * submit button is disabled when
	 * theres an empty field
	 * a field has an error
	 * submitting
	 */

	return (
		<div>
			<div>
				<div>
					<h1>Airsoft Naptár</h1>
					<Link to="/" className="underline">vissza a főoldalra</Link>
				</div>
			</div>
			<div className="grid place-content-center min-h-dvh">
				<Card className="w-[360px]">
					<h2>Felíratkozás email fiókal</h2>
					<form onSubmit={handleSubmit} noValidate autoComplete="off">
						<fieldset>
							<Label htmlFor="email">email</Label>
							<Input
								id="email"
								className="input"
								type="email"
								autoFocus
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={(e) => validateEmail()}
							/>
							{emailError && <p>{emailError}</p>}
						</fieldset>
						<fieldset>
							<Label htmlFor="password">jelszó</Label>
							<Input
								id="password"
								className="input"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onBlur={(e) => validatePassword()}
							/>
							{passwordError && <p>{passwordError}</p>}
						</fieldset>
						{formError && <p>{formError}</p>}

						<Button type="submit">Regisztrálok</Button>

						<div className="py-4">
							<p>
								<span>van már fiókod? &nbsp;</span>
								<Link to="/login" className="underline">jelentkezz be!</Link>
							</p>
						</div>
						<div className="bg-amber-400">
							<h3>figyu!</h3>
							<p>email fiókkal való regsztrálás csak ideiglenes!</p>
							<p>Ne használj létező email / jelszavat!</p>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
}
