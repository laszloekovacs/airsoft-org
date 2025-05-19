import { Link } from 'react-router'
import { eventRecord } from '~/schema/schema'

type EventSelect = typeof eventRecord.$inferSelect

export const Summary = ({ events }: { events: EventSelect[] }) => {
	if (events.length == 0) {
		return <p>nincsenek események</p>
	}

	return (
		<div>
			<table>
				{events.map((item, index) => (
					<tr key={item.id}>
						<Link to={`/dashboard/event/${item.urlSlug}/registration`}>
							<td>{item.createdAt}</td>
							<td>{item.title}</td>
						</Link>
					</tr>
				))}
			</table>
		</div>
	)
}
