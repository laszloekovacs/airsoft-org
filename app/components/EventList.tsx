import type { InferSelectModel } from "drizzle-orm"
import { Link } from "react-router"
import { eventRecordTable } from "~/schema/schema"

export const EventList = (props: {
	eventList: Array<InferSelectModel<typeof eventRecordTable>>
}) => {
	const { eventList } = props

	return (
		<div className="h-full w-full">
			<div>
				<h1 className="text-center">Események</h1>

				{eventList.length == 0 && <NoEvents />}

				<ul>
					{eventList.map((e) => (
						<EventItem key={e.id} event={e} />
					))}
				</ul>
			</div>
		</div>
	)
}

export const EventItem = (props: {
	event: InferSelectModel<typeof eventRecordTable>
}) => {
	const { title, date, slug } = props.event
	return (
		<li>
			<Link to={`/events/${slug}`}>
				<h2>{title}</h2>
			</Link>
			<p>{date}</p>
		</li>
	)
}

const NoEvents = () => {
	return (
		<div className="text-center">
			<p>Nincs megjeleníthető esemeny</p>
		</div>
	)
}
