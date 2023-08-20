"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    const crispWebsiteId = process.env.CRISP_WEBSITE_ID!;
    useEffect(() => {
        Crisp.configure("6bbc993d-4fee-46fb-bbff-1f65ea3978b6");
    });

    return null;
};