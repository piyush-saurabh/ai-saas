import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate"

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";

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
            return new NextResponse("Prompt is required for video generation", { status: 400 });
        }

        // Check if we are on free trial
        const freeTrial = await checkApiLimit();

        // Check if we have have a paid subscription
        const isPro = await checkSubscription();
        
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired.", {status: 403});
        }

        // Ref: https://replicate.com/anotherjesse/zeroscope-v2-xl/api
        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt: prompt // we can directly use the shorthand (prompt) since key and value name are same
                }
            }
        );

        // After processing the API request, increase the access count by 1
        if(!isPro){
            await increaseApiLimit();
        }
        
        return NextResponse.json(response);


    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
