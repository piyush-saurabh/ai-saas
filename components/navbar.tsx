import { UserButton } from "@clerk/nextjs";

import MobileSidebar from "./mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";

const navBar = async () => {
    const apiLimitCount = await getApiLimitCount();

    // Check the subscription
    const isPro = await checkSubscription();

    return (
        <div className="flex items-center p-4">
            <MobileSidebar isPro={isPro} apiLimitCount = { apiLimitCount } />

            {/* Logged In Button */}
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}

export default navBar;