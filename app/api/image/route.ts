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

        // body of the request which we will receive from frontend
        // E.g. {"prompt": "something", "amount": "1", "resolution": "512x512"}
        const { prompt, amount = "1", resolution = "512x512"} = body;

        // If request is unauthenticated
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Validation on input fields
        if(!prompt){
            return new NextResponse("Prompt is required", {status: 400});
        }

        if(!amount){
            return new NextResponse("Number of images are required", {status: 400});
        }

        if(!resolution){
            return new NextResponse("Resolution of the image is required", {status: 400});
        }

        // Invoke OpenAI to generate image
        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        });

        return NextResponse.json(response.data);


    } catch (error){
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}
