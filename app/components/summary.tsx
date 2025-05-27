import { Link } from "react-router"
import type { eventRecordTable } from "~/schema"

type EventSelect = typeof eventRecordTable.$inferSelect

export const Summary = ({ events }: { events: EventSelect[] }) => {
	if (events.length == 0) {
		return <p>nincsenek események</p>
	}

	return (
		<div>
			<table>
				{events.map((item, index) => (
					<tr key={item.id}>
						<Link to={`/dashboard/event/${item.slug}/assign`}>
							<td>{item.createdAt}</td>
							<td>{item.title}</td>
						</Link>
					</tr>
				))}
			</table>
		</div>
	)
}
