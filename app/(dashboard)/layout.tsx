import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limits";

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    // API limit
    // This runs on the server
    const apiLimitCount = await getApiLimitCount();

    return (
        // Side Bar
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900 ">
                <Sidebar apiLimitCount = { apiLimitCount } />
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