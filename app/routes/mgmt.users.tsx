import type { Route } from './+types/mgmt.users'
import { UserTable } from '~/components/mgmt/UserTable'
import { queries } from '~/queries/queries.server'
import { Link } from 'react-router'

export const loader = async () => {
	const users = await queries.getUsers()
	return { users }
}

export default function ManagementUsersPage({
	loaderData,
}: Route.ComponentProps) {
	const { users } = loaderData

	return (
		<div>
			<Link to="/">vissza a fooldalra</Link>
			<hr />
			<UserTable users={users} />
		</div>
	)
}
