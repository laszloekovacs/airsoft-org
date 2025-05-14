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
		<div className='grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-xl font-bold'>
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
		<ul className='flex flex-row gap-4 justify-center'>
			{links.map(item => (
				<li key={item.label}>
					<Link to={item.to}>{item.label}</Link>
				</li>
			))}
		</ul>
	)
}
