import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { NavigationBar } from "~/components/navigation-bar"
import { Home, User } from "lucide-react"
import SearchContainer from "~/components/home/Search"


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
				<SearchContainer />
			</div>
		</div>
	)
}
