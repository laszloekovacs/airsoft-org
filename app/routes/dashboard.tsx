import { Link, Outlet } from 'react-router'
import { PageHeader } from '~/components/PageHeader'
import { DashboardLayout } from '~/components/DashboardLayout'
import Sitemap from '~/components/SiteLinks'

export default function DashboardIndex() {
	return (
		<DashboardLayout>
			<div>
				<PageHeader />
				<div>
					<Link to='/dashboard'>
						<h1>Dashboard</h1>
					</Link>

					<Link to='/dashboard/event/create'>új esemény</Link>
				</div>
			</div>

			<Outlet />
			<Sitemap />
		</DashboardLayout>
	)
}
