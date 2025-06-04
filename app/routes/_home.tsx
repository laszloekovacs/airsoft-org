import { Outlet } from "react-router"
import HomePageHeading from "~/components/HomePageHeading"
import SiteLinks from "~/components/site-links"
import { authServer } from "~/services/auth.server"
import type { Route } from "./+types/_home"
import {
	AuthenticatedSessionMenu,
	UnauthenticatedSessionMenu,
} from "~/components/home/SessionMenu"
import { Button } from "~/components/ui/button"
import { authClient } from "~/services/auth.client"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await authServer.api.getSession(request)

	if (sessionData) {

		return {
			name: sessionData.user.callsign ?? sessionData.user.email,
			image: sessionData.user.image || undefined
		}
	}

	return {}
}

export default function HomeContainer({ loaderData }: Route.ComponentProps) {

	const sessionMenu = loaderData?.name ? (
		<AuthenticatedSessionMenu email={loaderData.name} image={loaderData.image} />
	) : (
		<UnauthenticatedSessionMenu />
	)

	return (
		<div className="min-h-screen bg-background grid grid-rows-[auto_1fr_auto]">
			<HomePageHeading
				title="Airsoft naptár"
				sessionComponent={sessionMenu}
				links={[{ label: "szervezo", to: "dashboard" }]}
			/>

			<Outlet />

			<div>

				<SiteLinks />
				<Button variant="outline" onClick={() => { authClient.signOut() }}>logout</Button>
			</div>
		</div>
	)
}

