import { Link } from 'react-router'

export default function Sitemap() {
	const links = [
		{ to: '/', label: 'Home' },
		{ to: '/dashboard', label: 'Dashboard' },
		{ to: '/dashboard/event/create', label: 'Create Event' }
	]

	return (
		<div>
			<h1>Sitemap</h1>
			<ul>
				{links.map((link, index) => (
					<li key={index}>
						<Link to={link.to}>{link.label}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
