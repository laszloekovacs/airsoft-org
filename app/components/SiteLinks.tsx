import { Link } from "react-router"

export default function SiteLinks() {
	const links = [
		{ to: "/", label: "főoldal" },
		{ to: "/dashboard", label: "szervezőoldal" },
		{ to: "/login", label: "belépés" },
		{ to: "/signup", label: "regisztráció" },
		{ to: "/mgmt", label: "admin" },
	]

	return (
		<div>
			<h3>Airsoft naptár</h3>
			<ul className="flex flex-row gap-4 flex-wrap">
				{links.map((link) => (
					<li key={link.label}>
						<Link to={link.to}>{link.label}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
