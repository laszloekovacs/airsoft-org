import { NavLink } from "react-router";
import { Home, Users } from "lucide-react"

const links = [
    {
        name: "kezdőoldal", to: "#", icon: Home
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


export const NavigationBar = () => {
    return (
        <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
                const Icon = link.icon

                return (
                    <NavLink to={link.to}>
                        <Icon className="h-4 w-4" />
                        {link.name}
                    </NavLink>
                )
            })}
        </nav>
    )
}