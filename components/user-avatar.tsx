import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const UserAvatar = () => {

    // Extract user from Clerk
    const { user } = useUser();

    return (
        <div>
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />

                {/* If the image is not able to load */}
                <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}