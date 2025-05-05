import { Outlet, Link } from 'react-router'
import Sitemap from '~/components/sitemap'

export default function HomeContainer() {
	return (
		<div>
			<Link to='/'>
				<h1>Airsoft Naptár</h1>
			</Link>
			<Outlet />
			<Sitemap />
		</div>
	)
}
