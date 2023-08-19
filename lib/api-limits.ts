import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import { MAX_FREE_COUNTS } from "@/constants";

// Increase the API limit count everytime we ping any of the APIs
export const increaseApiLimit = async () => {
    const { userId } = auth();

    if(!userId){
        return;
    }

    // Check if user exists in the table
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if(userApiLimit){
        // User exists in the database
        await prismadb.userApiLimit.update({
            where: {userId: userId},
            data: { count: userApiLimit.count + 1 }
        });
    } else {
        // Create new entry in the table
        await prismadb.userApiLimit.create({
            data: {userId: userId, count: 1}
        });
    }
};

// Check if the current user has reached the limit
export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId){
        // User can not use the app
        return false;
    }

    // Fetch the current count
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS){
        // User can still use the app
        return true;
    } else {
        // User has already used the API MAX_FREE_COUNTS (e.g 5) number of times
        // Deny the access
        return false;
    }
}