import { UserButton } from "@clerk/nextjs";

import MobileSidebar from "./mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limits";

const navBar = async () => {
    const apiLimitCount = await getApiLimitCount();

    return (
        <div className="flex items-center p-4">
            <MobileSidebar apiLimitCount = { apiLimitCount } />

            {/* Logged In Button */}
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}

export default navBar;