"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useProModal } from "@/hooks/use-pro-modal";
import { Check, Code, ImageIcon, MessageSquare, Music, Video, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";



// Tools to display on dashboard
const tools = [
    {
      label: "Conversation",
      icon: MessageSquare,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Music Generation",
      icon: Music,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Image Generation",
      icon: ImageIcon,
      color: "text-pink-700",
      bgColor: "bg-pink-700/10",
    },
    {
      label: "Video Generation",
      icon: Video,
      color: "text-orange-700",
      bgColor: "bg-orange-700/10",
    },
    {
      label: "Code Generation",
      icon: Code,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];


export const ProModal = () => {
    // Connect to hook (zudstand) for global state
    const proModal = useProModal();

    // Loading state
    const [loading, setLoading] = useState(false);

    // Event for onclick of Upgrade button
    // Invoke Stripe payment workflow
    const onSubscribe = async () => {
        try{
            setLoading(true);

            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;
        }catch(error){
            console.log(error, "STRIPE_CLIENT_ERROR");
        } finally{
            setLoading(false);
        }
    };


    return(
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold py-1">
                            Upgrade to Genius
                            <Badge className="uppercase text-sm py-1" variant="premium">
                                pro
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {/* Iterate over all our tools */}
                        {tools.map((tool) => (
                            <Card key={tool.label} className="flex items-center justify-between p-3 border-black/5">
                                <div className="flex items-center gap-x-4">

                                    {/* Icons */}
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)} />
                                    </div>

                                    {/* Labels */}
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>

                                {/* Tick Icon at the end of each item*/}
                                <Check className="text-primary w-5 h-5" />
                            </Card>
                        ))}

                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={onSubscribe} size="lg" variant="premium" className="w-full">
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};