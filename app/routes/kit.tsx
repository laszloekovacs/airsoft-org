import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export default function Kits() {
	const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>([
		"Kraftwerk",
		"Duran Duran",
		"depeche mode",
	]);

	return (
		<div>
			<ul ref={parent}>
				{tapes.map((tape) => (
					<li data-label={tape} key={tape}>
						{tape}
					</li>
				))}
			</ul>
		</div>
	);
}
