import { NavLink } from "react-router";
import { Home, Users } from "lucide-react"

const links = [
    {
        name: "kezdőoldal", to: "/", icon: Home
    },
    {
        name: "felhasználók", to: "#", icon: Users
    }
]

type Icon = typeof Home

type Props = {
    links: {
        name: string
        to: string
        icon: Icon
    }[]
}


export const NavigationBar = ({ links }: Props) => {
    return (
        <nav className="flex flex-wrap gap-2 py-4">
            {links.map((link) => {
                const Icon = link.icon

                return (
                    <NavLink to={link.to} key={link.to} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                        <Icon className="h-4 w-4" />
                        {link.name}
                    </NavLink>
                )
            })}
        </nav>
    )
}