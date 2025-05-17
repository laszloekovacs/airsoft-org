import { useParams } from 'react-router'

export default function AccountActionResult() {
	const params = useParams<string>()

	return <pre>{JSON.stringify(params)}</pre>
}
