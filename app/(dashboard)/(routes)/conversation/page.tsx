"use client";
import axios from "axios";

// For creating schema and validations
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OpenAI } from "openai";

import { formSchema } from "./constants";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";


const ConversationPage = () => {
    const router = useRouter();

    // Pro modal from react hook global state
    const proModal = useProModal();

    // Contains the response message
    const [messages, setMessages] = useState<OpenAI.Chat.Completions.ChatCompletionMessage[]>([])

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
        console.log(values);
        try{
            const userMessage: OpenAI.Chat.Completions.ChatCompletionMessage = {
                role: "user",
                content: values.prompt,
            };

            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/conversation", {
                messages: newMessages,
            });

            setMessages((current) => [...current, userMessage, response.data]);

            form.reset();

        } catch(error: any){
            // Check if the error is 403 (free trial expired)
            if(error?.response.status === 403){
                // Open the Pro Modal
                proModal.onOpen();
            }

            //console.log(error);
        } finally{
            // Refresh "ALL" the server side component
            // This is essential to update the progress bar
            router.refresh();
        }
    };

    return (
        <div>
            {/* Heading */}
            <Heading title="Conversation" description="Our most advanced conversation model." icon={MessageSquare} iconColor="text-violet-500" bgColor="bg-violet-500/10"/>

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
                                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="How do I calculate the radius of a circle?" {...field} />
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
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started"/>
                    )}

                    {/* Response Message */}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div key={message.content} className={cn("flex items-start w-full p-8 gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}>

                                {/* Decide which avatar to show (user or bot) */}
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar /> }

                                {/* Actual response from OpenAI */}
                                <p className="text-sm" >
                                    {message.content}
                                </p>
                                
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;