import { Link, Outlet } from 'react-router'
import Sitemap from '~/routes/_home/sitemap'

export default function DashboardIndex() {
	return (
		<div className='h-dvh w-full p-4 bg-background text-foreground'>
			<Link to='/dashboard'>
				<h1 className='text-2xl mb-4 font-bold'>Dashboard</h1>
			</Link>
			<Outlet />
			<Sitemap />
		</div>
	)
}
