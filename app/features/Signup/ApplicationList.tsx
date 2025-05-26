import { Button } from "~/components/ui/button"
import type { userAtEventView } from "~/schema/schema"

/**
 * Container for accepting users for an event
 */

type UserAtEvent = typeof userAtEventView.$inferSelect

type ApplicationListContainer = {
	applicants: UserAtEvent[]
	onAccept?: (id: number) => void
}

export const ApplicationListContainer = (props: ApplicationListContainer) => {
	const { applicants, onAccept } = props

	return (
		<div>
			<h1>Eseményre jelentkezők</h1>

			<ul>
				{applicants.map((applicant) => (
					<li key={applicant.signupId}>
						<ApplicationEntry onAccept={onAccept} applicant={applicant} />
					</li>
				))}
			</ul>
		</div>
	)
}

type ApplicationEntry = {
	applicant: UserAtEvent
	onAccept?: (id: number) => void
}

export const ApplicationEntry = (props: ApplicationEntry) => {
	const { applicant, onAccept } = props
	const { userName, isConfirmed, signupId } = applicant

	return (
		<div className="flex flex-row gap-4">
			<p>{userName}</p>
			{!isConfirmed && (
				<Button size="sm" variant="ghost" onClick={() => onAccept?.(signupId)}>
					elfogad
				</Button>
			)}
		</div>
	)
}
