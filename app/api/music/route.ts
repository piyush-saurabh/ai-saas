import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate"

import { checkSubscription } from "@/lib/subscription";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN! // add ! to handle the error if this varialbe is undefined
});



// Handler for API
export async function POST(
    req: Request
) {
    try {
        // Check if we are authenticated
        const { userId } = auth();
        const body = await req.json();

        // Get request from the post body
        const { prompt } = body;

        // If request is unauthenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Message/Prompt to send to OpenAI
        if (!prompt) {
            return new NextResponse("Prompt is required for music generation", { status: 400 });
        }

        // Check if we are on free trial
        const freeTrial = await checkApiLimit();

        // Check if we have have a paid subscription
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired.", { status: 403 });
        }

        // Ref: https://replicate.com/riffusion/riffusion/api
        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt
                }
            }
        );

        // After processing the API request, increase the access count by 1
        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response);


    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
