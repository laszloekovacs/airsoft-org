import { Button } from "~/components/ui/button"
import type { userAtEventView } from "~/schema/schema"

/**
 * Container for accepting users for an event
 */

type UserAtEventListItem = typeof userAtEventView.$inferSelect

type ParticipantListContainerProps = {
	participants: UserAtEventListItem[]
	onAccept?: () => void
}

export const ParticipantListContainer = ({
	participants,
	onAccept,
}: ParticipantListContainerProps) => {
	return (
		<div>
			<h1>Eseményre jelentkezők</h1>

			<ul>
				{participants.map((registrationEntry) => (
					<li key={registrationEntry.id}>
						<ParticipantListItem onAccept={onAccept} />
					</li>
				))}
			</ul>
		</div>
	)
}

type ParticipantListItemProps = {
	onAccept?: () => void
}

export const ParticipantListItem = ({ onAccept }: ParticipantListItemProps) => {
	return (
		<div>
			<Button size="sm" variant="ghost" onClick={onAccept}>
				elfogad
			</Button>
		</div>
	)
}
