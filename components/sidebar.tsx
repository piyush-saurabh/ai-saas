
"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { LayoutDashboard, MessageSquare, ArrowDownRightFromCircle, ImageIcon, VideoIcon, Music, Code, Settings } from "lucide-react";

import { cn } from "@/lib/utils";


const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]

});

// Array which contains all the routes
const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500"
    },
    {
        label: "Conversation",
        icon: MessageSquare,
        href: "/dashboard",
        color: "text-violet-500"
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        href: "/dashboard",
        color: "text-pink-700"
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        href: "/dashboard",
        color: "text-orange-700"
    },
    {
        label: "Music Generation",
        icon: Music,
        href: "/dashboard",
        color: "text-emrald-500"
    },
    {
        label: "Code Generation",
        icon: Code,
        href: "/dashboard",
        color: "text-green-700"
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard",
    },

];

const SideBar = () => {
    return (
        <div className="flex flex-col h-full space-y-4 py-4 bg-[#111827] text-white">

            {/* Logo */}
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    
                    <div className="relative h-8 w-8 mr-4">
                        <Image alt="Logo" fill src = "/logo.png"/>
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>
                        Genius
                    </h1>
                </Link>

                {/* Menu */}
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className="flex p-3 w-full justify-start text-sm group font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition">
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>


        </div>
    );
}

export default SideBar;