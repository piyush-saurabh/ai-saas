import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

import { Fragment } from "react";

interface HeadingProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string; //optional props
    bgColor?: string; //optional props
}

export const Heading = ({
    title,
    description,
    icon: Icon, // remapping icon to Icon so that it can be used in return
    iconColor,
    bgColor
}: HeadingProps) => {
    return (
        // React Fragment
        // Allows to return multiple elements (here, multiple div)

        <div className="flex items-center gap-x-3 mb-8 px-4 lg:px-8" >

            {/* Icon */}
            <div className={cn("p-2 w-fit rounded-md", bgColor)} >
                <Icon className={cn("w-10 h-10", iconColor)} />
            </div>

            {/* Title */}
            <div>
                <h2 className="text-3xl font-bold">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground" >
                    {description}
                </p>
            </div>

        </div>


    );
}