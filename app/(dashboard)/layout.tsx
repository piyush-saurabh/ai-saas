import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    // API limit
    // This runs on the server
    const apiLimitCount = await getApiLimitCount();

    // Check the subscription
    const isPro = await checkSubscription();

    return (
        // Side Bar
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900 ">
                <Sidebar isPro={isPro} apiLimitCount = { apiLimitCount } />
            </div>

            {/* Main Content  */}
            <main className="md:pl-72">
                <Navbar />
                {/* Render the content of /dashboard/page.tsx */}
                {children}
            </main>
        </div>
    );
    
}

export default DashboardLayout;