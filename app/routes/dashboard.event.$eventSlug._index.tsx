import { eq } from "drizzle-orm"
import * as d from "~/schema"
import database from "~/services/db.server"
import type { Route } from "./+types/dashboard.event.$eventSlug._index"


export const loader = async ({ params }: Route.LoaderArgs) => {
	const { eventSlug } = params

	// get event from slug
	const event = await database
		.select()
		.from(d.eventsTable)
		.where(eq(d.eventsTable.slug, eventSlug))

	if (event.length == 0) throw new Error()

	// get the combined view for users in groups
	const attendees = await database
		.select()
		.from(d.eventUserView)
		.where(eq(d.eventUserView.eventId, event[0].id))

	// get the available groups
	const factions = await database
		.select()
		.from(d.eventFaction)

	return { attendees, factions }
}


export default function RegistrationPage({ loaderData }: Route.ComponentProps) {
	const { attendees, factions } = loaderData

	// get array of users where faction is null
	const unasigned = attendees.filter((item) => item.factionId == null)

	return (
		<div>
			{/* unasigned players */}

			<FactionList faction={{ name: "kispadosok", id: 0, eventId: 0 }} members={unasigned} />

			{/* loop trough factions */}
			<ul>
				{factions.map((faction) =>
					<FactionList key={faction.id} faction={faction} members={attendees.filter((item) => item.factionId == faction.id)} />
				)}
			</ul>
		</div>
	)
}


type FactionListProps = {
	faction: {
		id: number,
		eventId: number,
		name: string,
		description: string | null,
		expectedParticipants: number | null,
	}
	members: Array<{
		id: number,
		email: string | null
	}>
}

const FactionList = (props: FactionListProps) => {
	const { faction, members } = props

	// create drag and drop list
	const items = members

	const handleDrop = (e) => {
		e.preventDefault()
		e.dataTransfer
		console.log(e.dataTransfer)
	}

	const handleDragEnter = (e) => {
		e.preventDefault()
		console.log("enter")
	}

	const handleDragOver = (e) => {
		e.preventDefault()
	}

	const handleDragStart = (e) => {
		e.preventDefault()
		console.log("Start")

	}

	return (
		<div draggable onDrop={handleDrop} >
			<h2>{faction.name}</h2>
			<ul>
				{items.map((item) => (
					<li key={item.id} data-label={item.email} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
						<pre>{JSON.stringify(item, null, 2)}</pre>
					</li>
				))}
			</ul>
			<hr />
		</div>
	)
}