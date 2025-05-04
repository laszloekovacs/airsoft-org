import { Outlet } from 'react-router'
import Sitemap from '~/components/sitemap'

export default function HomeContainer() {
	return (
		<div>
			<Outlet />
			<Sitemap />
		</div>
	)
}
