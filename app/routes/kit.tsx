import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { NavigationBar } from "~/components/navigation-bar"
import { Home, User } from "lucide-react"
import { logger } from '~/services/logging.server'


export const loader = () => {

	logger.info("loading Kits endpoint")

	return {}
}



export default function Kits() {
	const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>(
		["Kraftwerk", "Duran Duran", "depeche mode"],
		{
			group: "tapes",
		},
	)

	return (
		<div>
			<div>
				<NavigationBar links={[
					{
						name: "játékosos",
						icon: <Home />,
						to: "."
					},
					{
						name: "csapatok",
						icon: <User />,
						to: "groups"
					}
				]} />
			</div>

			<ul ref={parent}>
				{tapes.map((tape) => (
					<li data-label={tape} key={tape}>
						{tape}
					</li>
				))}
			</ul>


			<div>
				<Example />
			</div>
		</div>
	)
}



function Example() {
	return (
		<Menu>
			<MenuButton>My account</MenuButton>
			<MenuItems anchor="bottom">
				<MenuItem>
					<a className="block data-focus:bg-blue-100" href="/settings">
						Settings
					</a>
				</MenuItem>
				<MenuItem>
					<a className="block data-focus:bg-blue-100" href="/support">
						Support
					</a>
				</MenuItem>
				<MenuItem>
					<a className="block data-focus:bg-blue-100" href="/license">
						License
					</a>
				</MenuItem>
			</MenuItems>
		</Menu>
	)
}