"use client";
import axios from "axios";

// For creating schema and validations
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OpenAI } from "openai";

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const ImagePage = () => {
    const router = useRouter();

    // Pro modal from react hook global state
    const proModal = useProModal();

    // Images which are received from openAI
    const [images, setImages] = useState<string[]>([]);

    // Performing validation on the form elements
    const form = useForm<z.infer<typeof formSchema >>({
        resolver: zodResolver(formSchema), // perform the validation
        // Default value of all the fields present in the form
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });

    // Extract the loading state
    const isLoading = form.formState.isSubmitting;

    // Form submit action. Request will be sent to an API
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        try{

            // Reset all the photos everytime the submit the new request
            setImages([]);

            // Send POST request with request body - values (coming from onSubmit)
            const response = await axios.post("/api/image", values);

            // In the response, we will get the list of urls. Extract all the image url and store it in urls array
            const urls = response.data.map((image: {url: string}) => image.url);

            setImages(urls);
            
            form.reset();

        } catch(error: any){
            // Check if the error is 403 (free trial expired)
            if(error?.response?.status === 403){
                // Open the Pro Modal
                proModal.onOpen();
            }else {
                toast.error("Something went wrong");
            }
        } finally{
            // Refresh server side component
            router.refresh();
        }
    };

    return (
        <div>
            {/* Heading */}
            <Heading title="Image Generation" description="Turn your prompt into an image." icon={ImageIcon} iconColor="text-pink-700" bgColor="bg-pink-700/10"/>

            {/* Form */}
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form} >
                        {/* Native HTML form */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-2 w-full px-3 md:px-6 rounded-lg border focus-within:shadow-sm " >

                            {/* Input Textbox */}
                            <FormField name="prompt" render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-6">
                                    <FormControl className="m-0 p-0" >
                                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="A picture of a horse in Swiss alps" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Dropdown for number of images */}
                            <FormField name="amount" control={form.control } render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-2">
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value}/>
                                            </SelectTrigger>
                                        </FormControl>

                                        {/* Display the list of options */}
                                        <SelectContent>
                                            {amountOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            ) } />

                            {/* Dropdown for resolution of images */}
                            <FormField name="resolution" control={form.control } render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-2">
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value}/>
                                            </SelectTrigger>
                                        </FormControl>

                                        {/* Display the list of options */}
                                        <SelectContent>
                                            {resolutionOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            ) } />

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
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}

                    {/* Display the empty container if there is no message */}
                    {images.length === 0 && !isLoading && (
                        <Empty label="No images generated"/>
                    )}

                    {/* Response Message */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid:cols-4 gap-4 mt-8" >
                        {images.map((src) => (
                            <Card key={src} className="rounded-lg overflow-hidden">
                                <div className="relative aspect-square">
                                    <Image alt="Image" fill src={src} />
                                </div>
                                <CardFooter className="p-2">
                                    <Button variant="secondary" className="w-full" onClick={() => {
                                        window.open(src);
                                    }}>

                                        {/* Download Icon */}
                                        <Download className="h-4 w-4 mr-2" />

                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default ImagePage;