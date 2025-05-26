import { Button } from "~/components/ui/button"
import type { userAtEventView } from "~/schema/schema"

/**
 * Container for accepting users for an event
 */

type UserAtEvent = typeof userAtEventView.$inferSelect

type ParticipantListContainerProps = {
	participants: UserAtEvent[]
	onAccept?: (id: number) => void
}

export const ParticipantListContainer = (
	props: ParticipantListContainerProps,
) => {
	const { participants, onAccept } = props

	return (
		<div>
			<h1>Eseményre jelentkezők</h1>

			<ul>
				{participants.map((registrationEntry) => (
					<li key={registrationEntry.id}>
						<ParticipantListItem onAccept={onAccept} item={registrationEntry} />
					</li>
				))}
			</ul>
		</div>
	)
}

type ParticipantListItem = {
	item: UserAtEvent
	onAccept?: (id: number) => void
}

export const ParticipantListItem = (props: ParticipantListItem) => {
	const { item, onAccept } = props
	const { userName, isConfirmed } = item

	return (
		<div className="flex flex-row gap-4">
			<p>{userName}</p>
			{!isConfirmed && (
				<Button size="sm" variant="ghost" onClick={() => onAccept?.(item.id)}>
					elfogad
				</Button>
			)}
		</div>
	)
}
