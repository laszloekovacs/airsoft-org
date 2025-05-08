import { Form } from 'react-router'
import { z } from 'zod'
import { useFormState } from '~/hooks/useformstate'

export default function PageWithForm() {
	const userSchema = z.object({
		name: z.string().min(2, 'longer please'),
		password: z.string().min(2, 'password needs to be longer')
	})

	type FormData = z.infer<typeof userSchema>

	const initialState = {
		name: 'mike',
		password: 'jeffs',
		age: '12'
	}

	const { formState, formError, formErrors, changedFields, bind } =
		useFormState<FormData>(initialState, userSchema)

	return (
		<Form method='post'>
			<label htmlFor='name'>your login name</label>
			<input type='text' {...bind('name')} />

			<label htmlFor='password'>your login name</label>
			<input type='text' {...bind('password')} />

			<input type='number' {...bind('age')} />

			<pre>
				{JSON.stringify(
					{ formState, formError, formErrors, changedFields },
					null,
					2
				)}
			</pre>
		</Form>
	)
}
