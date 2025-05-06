import type { InferSelectModel } from 'drizzle-orm'
import { Link } from 'react-router'
import { eventsTable } from '~/db/schema'

export const EventList = (props: {
	eventList: Array<InferSelectModel<typeof eventsTable>>
}) => {
	const { eventList } = props

	return (
		<div>
			<h1>Upcomming events</h1>
			<ul>
				{eventList.map(e => (
					<EventItem key={e.id} event={e} />
				))}
			</ul>
		</div>
	)
}

export const EventItem = (props: {
	event: InferSelectModel<typeof eventsTable>
}) => {
	const { title, date } = props.event
	return (
		<li>
			<Link to={`/events/${props.event.urlSlug}`}>
				<h2>{title}</h2>
			</Link>

			<p>{date}</p>
		</li>
	)
}
