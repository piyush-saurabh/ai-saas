"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs"; // useAuth is a hook. It is client side component

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({
    weight: "600",
    subsets: ["latin"],
});

export const LandingNavbar = () => {
    const { isSignedIn } = useAuth();

    return(
        <nav className="flex items-center justify-between p-4 bg-transparent">

            {/* Branding */}
            <Link href="/" className="flex items-center">
                {/* Logo */}
                <div className="relative h-8 w-8 mr-4">
                    <Image fill alt="logo" src="/logo.png" />
                </div>

                {/* Company Name */}
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                    Genius
                </h1>
            </Link>

            {/* Get started Button */}
            <div className="flex items-center gap-x-2">
                <Link href={isSignedIn? "/dashboard": "/sign-up"}>
                    <Button variant="outline" className="rounded-full">
                        Get Started
                    </Button>
                </Link>
            </div>
        </nav>
    );
}