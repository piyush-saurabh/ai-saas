import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        // Side Bar
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 ">
                <Sidebar />
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