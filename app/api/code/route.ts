import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Instruction for OpenAI model regarding how to behave
const instructionMessage: OpenAI.Chat.Completions.ChatCompletionMessage = {
    role: "system",
    content: "Your are a code generator. You must answer only in markdown code snippets. Use code comments for explaination." // Play with this parameter till you get the desired result
};


// Handler for "/api/code"
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
        if(!freeTrial){
            return new NextResponse("Free trial has expired.", {status: 403});
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages],
        });

        // After processing the API request, increase the access count by 1
        await increaseApiLimit();

        return NextResponse.json(response.choices[0].message);


    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
