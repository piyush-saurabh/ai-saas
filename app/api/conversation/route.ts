import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import OpenAI from 'openai';

//const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
  });

// Handler for API
export async function POST(
    req: Request
) {
    try{
        // Check if we are authenticated
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        // If request is unauthenticated
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Message/Prompt to send to OpenAI
        if(!messages){
            return new NextResponse("Messages are required", {status: 400});
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

        return NextResponse.json(response.choices[0].message);


    } catch (error){
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}
