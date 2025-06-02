import { createAuthClient } from 'better-auth/react'
import { Link } from 'react-router'

export function PageHeader() {
	const headinglinks = [
		{
			to: '/dashboard',
			label: 'szervező'
		}
	]

	return (
		<header>
			<h1>
				<Link to='/'>Airsoft Naptár</Link>
			</h1>
			<nav>
				{headinglinks.map(item => (
					<li key={item.label}>
						<Link to={item.to}>{item.label}</Link>
					</li>
				))}
			</nav>
			<Session />
		</header>
	)
}

/* you need to recreate the hook inside client components*/
const { useSession } = createAuthClient()

const Session = () => {
	const { isPending, data, error } = useSession()

	if (isPending) return <p>loading...</p>
	if (error) return <p>error loading session: {error.message}</p>

	return (
		<div>
			<p>{data?.user.name}</p>
		</div>
	)
}
