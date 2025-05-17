import { Outlet, Link } from 'react-router'
import Sitemap from '~/routes/_home/sitemap'
import type { Route } from './+types/route'
import { authServer } from '~/services/auth.server'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)

	return { ...sessionData }
}

export default function HomeContainer({ loaderData }: Route.ComponentProps) {
	const user = loaderData?.user

	return (
		<div>
			<div>
				<h1>
					<Link to='/'>Airsoft Naptár</Link>
				</h1>
				<Navbar />
				{user ? <Session name={user.name} /> : <LoginOrRegister />}
			</div>
			<Outlet />
			<Sitemap />
		</div>
	)
}

const Session = ({ name }: { name: string }) => {
	return <>{name && <span>{name}</span>}</>
}

const LoginOrRegister = () => {
	return <Link to='/account/login'>belepes</Link>
}

const Navbar = () => {
	const links = [
		{ label: 'szervezo', to: '/dashboard' },
		{ label: 'regisztralas', to: '/account/register' }
	]

	return (
		<ul>
			{links.map(item => (
				<li key={item.label}>
					<Link to={item.to}>{item.label}</Link>
				</li>
			))}
		</ul>
	)
}
