import { Link } from "react-router"

interface NavLinks {
	label: string
	to: string
}

interface HomePageHeadingProps {
	title: string
	links: NavLinks[]
	sessionComponent: React.ReactNode
}

const HomePageHeading: React.FC<HomePageHeadingProps> = ({
	title,
	links,
	sessionComponent,
}) => (
	<header className="w-full flex flex-row items-center justify-between p-2">
		<Link to="/">
			<h1 className="m-0 text-lg font-bold">{title}</h1>
		</Link>
		<nav>
			<ul className="flex flex-row list-none m-0 p-0 gap-4">
				{links.map((link) => (
					<li key={link.to}>
						<Link to={link.to} className="text-blue-600 hover:underline">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
		<div>{sessionComponent}</div>
	</header>
)

export default HomePageHeading
