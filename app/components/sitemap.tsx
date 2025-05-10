import { Link } from 'react-router'

export default function Sitemap() {
	const links = [
		{ to: '/', label: 'főoldal' },
		{ to: '/dashboard', label: 'szervezőoldal' },
		{ to: '/dashboard/event/create', label: 'esemény létrehozása' },
		{ to: '/account', label: 'fiók' }
	]

	return (
		<div className='p-4 mt-8'>
			<h1 className='font-bold'>Oldalak</h1>
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
