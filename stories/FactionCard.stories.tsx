import type { Meta, StoryObj } from "@storybook/react-vite"
import "../app/tailwind.css"
import "../app/styles.css"
import { FactionCard } from "../app/components/dashboard/faction-card"


const meta = {
	title: "Components/FactionCard",
	component: FactionCard,
} satisfies Meta<typeof FactionCard>

export default meta

export const FactionStory: StoryObj<typeof meta> = {
	args: {
		description: "something",
		name: "alpha",
		id: 1,
		expectedParticipants: 4,
		eventId: 5
	},
}
