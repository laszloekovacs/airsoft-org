import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { Button } from "../app/components/Shared/button"

const meta = {
	title: "Example/Button",
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},

	argTypes: {
		backgroundColor: { control: "color" },
	},

	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {
		size: "small",
		intent: "primary",
		children: "hello",
	},
}

export const Secondary: Story = {
	args: {
		intent: "secondary",
		children: "hello",
	},
}

export const Small: Story = {
	args: {
		size: "small",
		children: "hello",
	},
}
