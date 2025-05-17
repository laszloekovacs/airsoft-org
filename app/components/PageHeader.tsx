import { Link } from 'react-router'

export function PageHeader() {
	const headinglinks = [
		{
			to: '/dashboard',
			label: 'szervező'
		}
	]

	return (
		<header>
			<h1>
				<Link to='/'>Airsoft Naptár</Link>
			</h1>
			<nav>
				{headinglinks.map(item => (
					<li key={item.label}>
						<Link to={item.to}>{item.label}</Link>
					</li>
				))}
			</nav>
		</header>
	)
}
