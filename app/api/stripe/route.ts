import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

// Handler function
export async function GET() {
    try {

        // Get user info from Clerk
        const { userId } = auth();
        const user = await currentUser();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Find current user subscription from database
        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId: userId
            }
        });

        if(userSubscription && userSubscription.stripeCustomerId){
            // User has already used stripe for purchase.
            // Redirect them to Billing page for cancelling or updating the subscription
            // We will have a webhook for this event
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({url: stripeSession.url}));
        }
        
        // If we reach here, it means current user don't have stripe session.
        // Redirect the user to Checkout page to make the payment
        // We will have a webhook for this event
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations",
                        },
                        unit_amount: 2000, // 20 USD
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId: userId, // value required for webhook
            }
        });

        return new NextResponse(JSON.stringify({url: stripeSession.url}));


    } catch (error) {
        console.log("STRIPE_ERROR", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}