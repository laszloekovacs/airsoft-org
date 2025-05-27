import type { Route } from "./+types/dashboard.event.$eventSlug.groups"

/**
 * Create groups for players to assigned to
 */

export function loader({ params }: Route.LoaderArgs) {
	const { eventSlug } = params

	// get the event from database
}

export default function EditEventGroupsPage() {
	return (
		<div>
			<h1>Csoportok</h1>
		</div>
	)
}
