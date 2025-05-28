import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { NavigationBar } from "~/components/navigation-bar"

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
				<NavigationBar />
			</div>

			<ul ref={parent}>
				{tapes.map((tape) => (
					<li data-label={tape} key={tape}>
						{tape}
					</li>
				))}
			</ul>
		</div>
	)
}
