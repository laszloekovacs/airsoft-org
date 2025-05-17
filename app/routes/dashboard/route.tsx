import { Link, Outlet } from 'react-router'
import { PageLayout } from '~/components/PageLayout'
import Sitemap from '~/components/sitemap'

export default function DashboardIndex() {
	return (
		<PageLayout>
			<Link to='/dashboard'>
				<h1>Dashboard</h1>
			</Link>

			<Link to='/dashboard/event/create'>új esemény</Link>

			<Outlet />
			<Sitemap />
		</PageLayout>
	)
}
