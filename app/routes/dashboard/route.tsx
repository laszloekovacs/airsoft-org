import { Link, Outlet } from 'react-router'
import Sitemap from '~/routes/_home/sitemap'

export default function DashboardIndex() {
	return (
		<div>
			<Link to='/dashboard'>
				<h1>Dashboard</h1>
			</Link>
			<Outlet />
			<Sitemap />
		</div>
	)
}
