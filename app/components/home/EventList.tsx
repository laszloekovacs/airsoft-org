import type { InferSelectModel } from "drizzle-orm"
import { Link } from "react-router"
import type { events } from "~/schema"

export const EventList = (props: {
	eventList: Array<InferSelectModel<typeof events>>
}) => {
	const { eventList } = props

	return (
		<div className="h-full w-full">
			<div className="max-w-4xl mx-auto p-4">
				<h1 className="text-center text-xl font-bold">Események</h1>

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
	event: InferSelectModel<typeof events>
}) => {
	const { title, startDate, slug } = props.event
	return (
		<li className="flex flex-row gap-2 py-3">
			<p>{startDate}</p>
			<Link to={`/events/${slug}`}>
				<h2 className="font-semibold">{title}</h2>
			</Link>
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
