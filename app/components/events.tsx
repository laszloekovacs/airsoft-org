import { Link } from 'react-router'

type EventItemPropType = {
	id: number
	title: string
	description: string
	date: string
	location: string
}

export const EventList = (props: { events: EventItemPropType[] }) => {
	const { events } = props

	return (
		<div>
			<h1>Upcomming events</h1>
			{events.map(e => (
				<div key={e.id}>
					<EventItem event={e} />
				</div>
			))}
		</div>
	)
}

export const EventItem = (props: { event: EventItemPropType }) => {
	const { title, description, date, location } = props.event
	return (
		<div>
			<Link to={`/events/${props.event.id}`}>
				<h2>{title}</h2>
			</Link>
			<p>{description}</p>
			<p>{date}</p>
			<p>{location}</p>
		</div>
	)
}
