import { Link, Outlet } from "react-router"
import Sitemap from "~/components/SiteLinks"
import { Button } from "~/components/ui/button"

export default function DashboardIndex() {
	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="p-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="text-2xl font-bold text-primary">
							Airsoft Naptár - Szervező
						</Link>
						<div className="flex items-center space-x-2">
							<Button size="sm">
								Kijelentkezés
							</Button>
						</div>
					</div>
				</div>
			</header>

			<Outlet />
			<Sitemap />
		</div>
	)
}
