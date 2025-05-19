import { Link } from 'react-router'

export default function SiteLinks() {
	const links = [
		{ to: '/', label: 'főoldal' },
		{ to: '/dashboard', label: 'szervezőoldal' },
		{ to: '/login', label: 'belépés' },
		{ to: '/signup', label: 'regisztráció' }
	]

	return (
		<div>
			<h3>Oldalak</h3>
			<ul className='flex flex-row gap-4'>
				{links.map((link, index) => (
					<li key={index}>
						<Link to={link.to}>{link.label}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
