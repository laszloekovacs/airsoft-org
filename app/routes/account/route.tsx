import { Link, Outlet } from 'react-router'

export default function AccountLayout() {
	return (
		<div className='w-full h-dvh p-8'>
			<div>
				<h1 className='text-2xl mb-4'>Felhasználó fiók</h1>
				<div className='my-4'>
					<Link to='/'>Főoldal</Link>
				</div>

				<Outlet />
			</div>
		</div>
	)
}
