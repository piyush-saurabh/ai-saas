"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";

import { useEffect, useState } from "react";

// Interface for API count
interface MobileSidebarProps {
    apiLimitCount: number;
    isPro: boolean;
}

const MobileSidebar = ({
    apiLimitCount = 0,
    isPro = false,
}: MobileSidebarProps) => {
    
    // Fixing Hydration Error
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted){
        return null;
    }

    return (

        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden" >
                    {/* Hamburger Menu Icon */}
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0">
                <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
            </SheetContent>
            
        </Sheet>
        
    );
}

export default MobileSidebar;