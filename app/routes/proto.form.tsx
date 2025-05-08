import { Form } from 'react-router'
import { z } from 'zod'
import { useFormState } from '~/hooks/useformstate'

export default function PageWithForm() {
	const userSchema = z.object({
		name: z.string().min(2, 'longer please'),
		password: z.string().min(2, 'password needs to be longer'),
		age: z.number().min(10, 'larger number please')
	})

	type FormData = z.infer<typeof userSchema>

	const initialState = {
		name: 'mike',
		password: 'jeffs',
		age: 12
	}

	const { formState, formError, fieldErrors, changedFields, bind } =
		useFormState<FormData>(initialState, userSchema)

	return (
		<Form method='post' noValidate>
			<label htmlFor='name'>your login name</label>
			<input type='text' {...bind('name')} />

			<label htmlFor='password'>your login name</label>
			<input type='text' {...bind('password')} />

			<input type='number' {...bind('age')} />

			<pre>
				{JSON.stringify(
					{ formState, formError, fieldErrors, changedFields },
					null,
					2
				)}
			</pre>
		</Form>
	)
}
