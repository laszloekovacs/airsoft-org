import React from 'react'
import { Link } from 'react-router'

interface NavLinks {
	label: string
	to: string
}

interface HomePageHeadingProps {
	title: string
	links: NavLinks[]
	SessionComponent: React.ReactNode
}

const HomePageHeading: React.FC<HomePageHeadingProps> = ({
	title,
	links,
	SessionComponent,
}) => (
	<header className="flex flex-row items-center justify-between py-2">
		<Link to="/">
			<h1 className="m-0 text-lg font-bold">{title}</h1>
		</Link>
		<nav>
			<ul className="flex flex-row list-none m-0 p-0 gap-4">
				{links.map((link) => (
					<li key={link.to}>
						<Link
							to={link.to}
							className="text-blue-600 hover:underline">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
		<div>{SessionComponent}</div>
	</header>
)

export default HomePageHeading
