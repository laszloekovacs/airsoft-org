import { Link, Outlet } from 'react-router'
import { PageHeader } from '~/components/PageHeader'
import { PageLayout } from '~/components/PageLayout'
import Sitemap from '~/components/sitemap'

export default function DashboardIndex() {
	return (
		<PageLayout>
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
		</PageLayout>
	)
}
