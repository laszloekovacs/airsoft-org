import { UserTable } from '~/components/mgmt/UserTable'
import { queries } from '~/queries/queries.server'
import type { Route } from './+types/mgmt._index'
import { Link } from 'react-router'

export const loader = async () => {
	const users = await queries.getUsers()
	return { users }
}

export default function ManagementPageIndex({
	loaderData,
}: Route.ComponentProps) {
	const { users } = loaderData

	return (
		<div>
			<h2>Adminisztrator oldal</h2>
			<Link to="/">vissza a fooldalra</Link>
			<hr />
			<UserTable users={users} />
		</div>
	)
}
