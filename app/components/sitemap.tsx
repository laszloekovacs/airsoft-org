import { Link } from 'react-router'

export default function Sitemap() {
	const links = [
		{ to: '/', label: 'főoldal' },
		{ to: '/dashboard', label: 'szervezőoldal' },
		{ to: '/account/login', label: 'belépés' },
		{ to: '/account/register', label: 'regisztráció' }
	]

	return (
		<div>
			<h3>Oldalak</h3>
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
