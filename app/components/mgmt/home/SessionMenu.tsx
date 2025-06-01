import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "~/components/ui/button"

export const AuthenticatedSessionMenu = ({ email, image }: { email: string, image?: string | null }) => {
    return (
        <Button variant="ghost">
            <div className="flex flex-row gap-4">

                <p>{email}</p>

                <Avatar>
                    <AvatarImage src={image ?? undefined} className="w-6 h-6 rounded-full" />
                    <AvatarFallback>AN</AvatarFallback>
                </Avatar>
            </div>
        </Button>
    )
}

export const UnauthenticatedSessionMenu = () => {
    return (
        <p>login</p>
    )
}