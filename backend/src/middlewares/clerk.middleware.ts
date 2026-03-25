import { NextFunction, Request, Response } from "express";
import { Webhook } from "svix/dist/webhook";

const verifyClerkWebhook = async (reg: Request, res: Response, next: NextFunction) => {
    // Middleware to verify Clerk webhooks using Svix's signature verification
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    // Check if the webhook secret is configured in environment variables
    if(!WEBHOOK_SECRET) {
        return res.status(500).json({error: "Webhook secret not configured"});
    }

    const svix_id = (reg.header("svix-id") || "").toString();
    const svix_timestamp = (reg.header("svix-timestamp") || "").toString();
    const svix_signature = (reg.header("svix-signature") || "").toString();

    console.log("Received webhook with headers:", {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature
    });
    // Validate that all required Svix headers are present
    if(!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({error: "Missing required Svix headers"});
    }
    // Prepare headers and payload for signature verification
    const headers = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature
    };

    // Convert the request body to a string for signature verification
    const payload = JSON.stringify(reg.body);

    // Verify the webhook signature using Svix's library
    const wh = new Webhook(WEBHOOK_SECRET);
    try {
        await wh.verify(payload, headers);
        next(); // Signature is valid, proceed to the controller
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return res.status(400).json({error: "Invalid webhook signature"});
    }
}

export  {verifyClerkWebhook};