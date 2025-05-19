import type { InferSelectModel } from 'drizzle-orm'
import { Link } from 'react-router'
import { user } from '~/schema/auth-schema'

interface UserTableProps {
	users: Array<InferSelectModel<typeof user>>
}

export const UserTable = ({ users }: UserTableProps) => {
	if (users.length == 0) return <NoUsers />

	return (
		<table className="min-w-full border font-mono">
			<thead>
				<tr>
					<th className="text-left">Név</th>
					<th className="text-left">Email</th>
					<th className="text-left">Jogosultságok</th>
				</tr>
			</thead>
			<tbody>
				{users.map((user) => (
					<UserListItem
						key={user.id}
						item={user}
					/>
				))}
			</tbody>
		</table>
	)
}

const UserListItem = ({ item }: { item: InferSelectModel<typeof user> }) => {
	const { name, email, claims } = item

	return (
		<tr>
			<td>
				<Link to={`#`}>{name}</Link>
			</td>
			<td>{email}</td>
			<td>{claims?.toString()}</td>
		</tr>
	)
}

const NoUsers = () => {
	return (
		<div>
			<p>Nincsenek regisztralt felhasznalok</p>
		</div>
	)
}
