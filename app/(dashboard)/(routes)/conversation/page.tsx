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


const ConversationPage = () => {
    const router = useRouter();
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
            // TODO: Open Pro Modal
            console.log(error);
        } finally{
            // Refresh server side component
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
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div key={message.content}>
                                {message.content}
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;