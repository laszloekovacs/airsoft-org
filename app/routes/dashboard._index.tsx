import { Summary } from '~/components/dashboard/summary'
import Sitemap from '~/components/sitemap'

export default function DashboardIndex() {
	return (
		<div>
			<h1>Dashboard</h1>
			<Summary />
			<Sitemap />
		</div>
	)
}
