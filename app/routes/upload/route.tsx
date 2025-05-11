import { Form, useActionData } from 'react-router'
import type { Route } from './+types/route'
import { s3 } from 'bun'

export default function UploadPage() {
	const actionData = useActionData()

	return (
		<div>
			<h1>Upload file</h1>

			<Form method='post' encType='multipart/form-data'>
				<input type='file' name='file' />
				<input type='submit' value='Upload' />"
			</Form>

			{actionData && <pre>{JSON.stringify(actionData, null, 2)}</pre>}
		</div>
	)
}

export const action = async ({ request }: { request: Request }) => {
	const formData = await request.formData()
	const file = formData.get('file') as File | null

	if (!file) {
		return { status: 'error', message: 'No file uploaded' }
	}

	const arrayBuffer = await file.arrayBuffer()

	const result = await s3.write(file.name, arrayBuffer, {
		accessKeyId: process.env.ACCESSKEYID,
		secretAccessKey: process.env.SECRETACCESSKEY,
		bucket: process.env.BUCKET,
		endpoint: process.env.ENDPOINT
	})

	console.log(result)

	return { status: 'ok' }
}
