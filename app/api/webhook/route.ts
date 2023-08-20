import Stripe from "stripe";
import {headers} from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { subscribe } from "diagnostics_channel";

// This webhook runs independenly from our application
// It will be accessed by the Stripe, so we have to add it to the public route

// POST handler for webhook
export async function POST(req: Request) {
    const body = await req.text();

    const signature = headers().get("Stripe-Signature") as string;

    // We are going to look for 2 events
    // 1. Checkout session completed
    // 2. Invoice payment succeeded
    let event: Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch(error: any){
        return new NextResponse(`Webhook Error: $(error.message)`, {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Webhook 1: Checkout
    if(event.type === "checkout.session.completed") {
        // Retrieve the subscription details from stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // We don't know who did the payment
        if(!session?.metadata?.userId){
            return new NextResponse("User ID is required for subscription", { status: 400});
        }
    
        // If we reach here, it means we have a mapping of user ID and stripe payment subscription
        // Create an entry in database
        await prismadb.userSubscription.create({
            data:{
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        });
    }

    // Webhook 2: Manage existing subscription
    if(event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // update the database with the subscription
        await prismadb.userSubscription.update({
            where:{
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    return new NextResponse(null, {status: 200});
}

