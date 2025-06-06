import { Link, Outlet } from "react-router"
import type { Route } from "./+types/dashboard.event.$eventSlug"
import { ArrowLeft } from "lucide-react"
import { NavigationBar } from "~/components/navigation-bar"
import { Home, Group } from "lucide-react"

const editorLinks = []


export default function DashboardEventsPage({
	loaderData,
}: Route.ComponentProps) {

	return (
		<div className="p-4">

			<Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Vissza az eseményekhez
			</Link>

			<NavigationBar links={[
				{
					name: "játékosok",
					to: ".",
					icon: <Home className="w-4 h-4" />
				},
				{
					name: "csoportok",
					to: "./groups",
					icon: <Group className="w-4 h-4" />
				}
			]} />

			<Outlet />
		</div>
	)
}

