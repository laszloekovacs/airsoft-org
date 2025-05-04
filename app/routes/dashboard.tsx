import { Outlet } from 'react-router'
import Sitemap from '~/components/sitemap'

export default function DashboardIndex() {
	return (
		<div>
			<h1>Dashboard</h1>
			<Outlet />
			<Sitemap />
		</div>
	)
}
