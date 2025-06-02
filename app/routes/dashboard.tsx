import { Link, Outlet } from "react-router"
import Sitemap from "~/components/SiteLinks"
import { Button } from "~/components/ui/button"
import type { Route } from "./+types/dashboard"
import { AuthorizedOnly } from "~/services/auth.server"
import HomePageHeading from "~/components/HomePageHeading"
import { AuthenticatedSessionMenu } from "~/components/home/SessionMenu"

export async function loader({ request }: Route.LoaderArgs) {
	const { user } = await AuthorizedOnly(request, ["organizer"])

	return {
		name: user.email,
		image: user.image,
	}
}

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
	const { name, image } = loaderData

	return (
		<div className="min-h-screen bg-background grid grid-rows-[auto_1fr_auto]">
			<HomePageHeading
				title="szervező"
				sessionComponent={
					<AuthenticatedSessionMenu email={name} image={image ?? undefined} />
				}
				links={[]}
			/>

			<Outlet />
			<Sitemap />
		</div>
	)
}
