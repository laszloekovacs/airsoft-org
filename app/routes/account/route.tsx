import { Link, Outlet } from 'react-router'

export default function AccountLayout() {
	return (
		<div>
			<h1>Fiók</h1>
			<Link to='/'>Főoldal</Link>

			<Outlet />
		</div>
	)
}
