import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { userId } = auth();

    if(!userId) {
        return false;
    }

    // Find user subscription
    const userSubscription = await prismadb.userSubscription.findUnique({
        where: {
            userId: userId
        },
        select:{
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if(!userSubscription){
        return false;
    }

    // Check if the subscription is valid
    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid; // ensure that return value is always boolean
}