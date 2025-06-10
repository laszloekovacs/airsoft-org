import type { Meta, StoryObj } from "@storybook/react-vite"
import SiteLinks from "../app/components/site-links"
import { createRoutesStub } from "react-router"
import { MemoryRouter } from "react-router"
import "../app/tailwind.css"
import "../app/styles.css"


const stub = createRoutesStub([{ path: "/login" }])

const Route = () => (<MemoryRouter>
	<SiteLinks />
</MemoryRouter>)

const meta = {
	title: "Components/SiteLinks",
	component: Route,
} satisfies Meta<typeof Route>

export default meta

export const Viewing: StoryObj<typeof meta> = {
	args: {},
}
