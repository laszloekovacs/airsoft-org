import type { InferSelectModel } from "drizzle-orm"
import { Button } from "~/components/ui/button"
import type { user } from "~/schema/auth-schema"
import type { userAtEventTable, eventRecordTable } from "~/schema"

/**
 * Container for accepting users for an event
 */
type ApplicationListContainer = {}

export const ApplicationListContainer = (props: ApplicationListContainer) => {
	// drag and drop list
}
