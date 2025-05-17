import { Outlet, Link } from 'react-router'
import Sitemap from '~/components/sitemap'
import type { Route } from './+types/route'
import { authServer } from '~/services/auth.server'
import styles from './home.module.css'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)

	return { ...sessionData }
}

export default function HomeContainer({ loaderData }: Route.ComponentProps) {
	const user = loaderData?.user

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>
					<Link to='/'>Airsoft Naptár</Link>
				</h1>
				<SiteNavigation />
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

const SiteNavigation = () => {
	const links = [
		{ label: 'szervező', to: '/dashboard' },
		{ label: 'regisztrálás', to: '/account/register' }
	]

	return (
		<ul className={styles.navbar}>
			{links.map(item => (
				<li key={item.label}>
					<Link to={item.to}>{item.label}</Link>
				</li>
			))}
		</ul>
	)
}
