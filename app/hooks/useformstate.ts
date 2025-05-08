import { useState } from 'react'
import { z } from 'zod'

export function useFormState<T extends Record<string, string>>(
	initialState: T,
	schema: z.ZodSchema<T>
) {
	// state, set to defaults
	const [formState, setFormState] = useState(initialState)

	// errors, maps keys => string array
	const [formErrors, setFormErrors] = useState<{
		[key: string]: string[]
	}>(Object.fromEntries(Object.keys(initialState).map(key => [key, []])))

	// form error, set by form validation or custom logic, array of strings
	const [formError, setFormError] = useState<string[]>([])

	// changed fields, maps key => boolean
	const [changedFields, setChangedFields] = useState<{
		[key: string]: boolean
	}>(Object.fromEntries(Object.keys(initialState).map(key => [key, false])))

	// usually called from onChange
	const setFieldValue = (field: string, value: string) => {
		setFormState(state => ({
			...state,
			[field]: value
		}))

		setChangedFields(fields => ({
			...fields,
			[field]: value != initialState[field]
		}))
	}

	// automatically sets attributes of input tags eg.: {...bind("name")}
	const bind = (field: string) => {
		return {
			name: field,
			value: formState[field],
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				setFieldValue(field, e.target.value)
			}
		}
	}

	return {
		formState,
		formErrors,
		formError,
		changedFields,
		setFieldValue,
		bind
	}
}
