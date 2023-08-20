import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";

import { checkSubscription } from "@/lib/subscription";

import OpenAI from 'openai';



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

// Handler for API
export async function POST(
    req: Request
) {
    try {
        // Check if we are authenticated
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;


        // If request is unauthenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Message/Prompt to send to OpenAI
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        // Check if we are on free trial
        const freeTrial = await checkApiLimit();

        // Check if we have have a paid subscription
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired.", { status: 403 });
        }

        // old
        // const response = await openai.chat({
        //     model: "gpt-3.5-turbo",
        //     messages
        // });


        // New
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        // After processing the API request, increase the access count by 1
        // Increase the api count only if the user is on free trial
        if (!isPro) {
            await increaseApiLimit();
        }


        return NextResponse.json(response.choices[0].message);


    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
