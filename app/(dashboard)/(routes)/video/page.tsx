"use client";
import axios from "axios";

// For creating schema and validations
import * as z from "zod";
import { Heading } from "@/components/heading";
import { VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./constants";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";


const VideoPage = () => {
    const router = useRouter();

    // Pro modal from react hook global state
    const proModal = useProModal();


    // Contains the response message
    const [video, setVideo] = useState<string>()

    // Functions which form will need
    const form = useForm<z.infer<typeof formSchema >>({
        resolver: zodResolver(formSchema), // perform the validation
        defaultValues: {
            prompt: "" // form will have only 1 input
        }
    });

    // Extract the loading state
    const isLoading = form.formState.isSubmitting;

    // Form submit action. Request will be sent to an API
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        try{
            setVideo(undefined);

            const response = await axios.post("/api/video", values);

            setVideo(response.data[0]);

            form.reset();

        } catch(error: any){
            // Check if the error is 403 (free trial expired)
            if(error?.response.status === 403){
                // Open the Pro Modal
                proModal.onOpen();
            }
        } finally{
            // Refresh server side component
            router.refresh();
        }
    };

    return (
        <div>
            {/* Heading */}
            <Heading title="Video Generation" description="Turn your prompt into video." icon={VideoIcon} iconColor="text-orange-700" bgColor="bg-orange-700/10"/>

            {/* Form */}
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form} >
                        {/* Native HTML form */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-2 w-full px-3 md:px-6 rounded-lg border focus-within:shadow-sm" >

                            {/* Input Textbox */}
                            <FormField name="prompt" render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0" >
                                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Clown fish swimming around a coral reef" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Button */}
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Response */}
                <div className="space-y-4 mt-4">

                    {/* If form is loading, display the loading container */}
                    {isLoading && (
                        <div className="flex items-center justify-center p-8 rounded-lg w-full bg-muted">
                            <Loader />
                        </div>
                    )}

                    {/* Display the empty container if there is no message */}
                    {!video && !isLoading && (
                        <Empty label="No video generated"/>
                    )}

                    {/* Response Message */}
                    {/* Show to result in HTML5 element ONLY if we have a video in react state */}
                    {video && (
                        <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                            <source src={video} />
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoPage;