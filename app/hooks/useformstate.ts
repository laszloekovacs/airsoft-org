import { useState } from 'react'
import { z } from 'zod'

export function useFormState<T extends Record<string, string | number>>(
	initialState: T,
	schema: z.ZodSchema<T>
) {
	/**
	 * internal state of the form, set from initial state
	 */
	const [formState, setFormState] = useState(initialState)

	/**
	 * errors for individual fields. can handle multiple
	 * maps key => string[]
	 */
	const [fieldErrors, setFieldErrors] = useState<{
		[key: string]: string[]
	}>(Object.fromEntries(Object.keys(initialState).map(key => [key, []])))

	/**
	 * Error relating to the form and not individual fields
	 */
	const [formError, setFormError] = useState<string[]>([])

	/**
	 * fields that have changed
	 * maps key => boolean
	 */
	const [changedFields, setChangedFields] = useState<{
		[key: string]: boolean
	}>(Object.fromEntries(Object.keys(initialState).map(key => [key, false])))

	/**
	 * change value, also check if it has changed relative to default value
	 */
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

	/**
	 * automatically sets attributes of input tags eg.: {...bind("name")}
	 */
	const bind = (field: string) => {
		return {
			name: field,
			value: formState[field],
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				setFieldValue(field, e.target.value)
			},
			onBlur: () => {
				validateField(field)
			}
		}
	}

	/**
	 * Validate field with zod and set it's errors
	 */
	const validateField = (field: string) => {
		const validation = schema.safeParse(formState)

		// map errors into an array of string and set it on the state
		if (validation.success) {
			setFieldErrors(errors => ({
				...errors,
				[field]: []
			}))
		} else {
			const errors = validation.error.flatten()
			console.log(errors)

			setFieldErrors(prev => ({
				...prev,
				[field]: errors.fieldErrors[field]
			}))
		}
	}

	return {
		formState,
		fieldErrors,
		formError,
		changedFields,
		setFieldValue,
		validateField,
		bind
	}
}
