import { Outlet, Link } from 'react-router'
import Sitemap from '~/components/sitemap'
import type { Route } from './+types/route'
import { authServer } from '~/services/auth.server'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)

	return { ...sessionData }
}

export default function HomeContainer({ loaderData }: Route.ComponentProps) {
	const user = loaderData?.user

	return (
		<div className='grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-xl font-bold'>
					<Link to='/'>Airsoft Naptár</Link>
				</h1>
				{user && <Session name={user.name} />}
			</div>
			<Outlet />
			<Sitemap />
		</div>
	)
}

const Session = ({ name }: { name: string }) => {
	return <>{name && <span>{name}</span>}</>
}
