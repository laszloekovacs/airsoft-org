import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export const AuthenticatedSessionMenu = ({ email, image }: { email: string, image?: string | undefined }) => {
    return (
        <Button variant="ghost">
            <div className="flex flex-row gap-2 justify-end">

                <p>{email}</p>

                <Avatar>
                    <AvatarImage src={image} className="w-6 h-6 rounded-full" />
                    <AvatarFallback>AN</AvatarFallback>
                </Avatar>
            </div>
        </Button>
    )
}

export const UnauthenticatedSessionMenu = () => {
    return (
        <Button asChild>
            <Link to="/login">Bejelentkezés</Link>
        </Button>
    )
}