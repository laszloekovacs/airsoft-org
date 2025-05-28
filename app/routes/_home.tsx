import { Outlet } from "react-router"
import HomePageHeading from "~/components/HomePageHeading"
import SiteLinks from "~/components/SiteLinks"
import { authServer } from "~/services/auth.server"
import type { Route } from "./+types/_home"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)

	return { ...sessionData }
}

export default function HomeContainer({ loaderData }: Route.ComponentProps) {
	const user = loaderData?.user

	return (
		<div className="min-h-screen bg-background">
			<HomePageHeading
				title="Airsoft naptár"
				SessionComponent={<p>login</p>}
				links={[{ label: "szervezo", to: "dashboard" }]}
			/>
			<Outlet />
			<SiteLinks />
		</div>
	)
}
