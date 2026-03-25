import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Webhook } from "svix";

const clerkWebhookController = async (req: Request, res: Response) => {
    // 1. Webhook Secret aus den Umgebungsvariablen laden
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
        return res.status(500).json({ error: "Webhook secret missing" });
    }

    // 2. Svix Header extrahieren
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: "Missing svix headers" });
    }

    // 3. Body verifizieren (Wichtig: req.body muss das rohe JSON sein)
    const payload = JSON.stringify(req.body);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).json({ error: "Invalid signature" });
    }

    // 4. Daten aus dem verifizierten Event extrahieren
    const { id } = evt.data; // Clerk User ID
    const eventType = evt.type;

    try {
        switch (eventType) {
            case "user.created":
                const { first_name, last_name, image_url, email_addresses } = evt.data;
                const email = email_addresses?.[0]?.email_address;
                const fullName = `${first_name || ""} ${last_name || ""}`.trim();

                // Speichere die Clerk ID mit! (Wichtig für Updates/Delete)
                const newUser = await User.create({
                    fullName: fullName || "Unknown",
                    email,
                    imageUrl: image_url,
                });
                
                console.log(`User created: ${id}`);
                break;

            case "user.updated":
                // Logik für Update hier...
                break;

            case "user.deleted":
                // Hier löschst du basierend auf der Clerk ID
                await User.findOneAndDelete({ clerkId: id });
                break;
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export { clerkWebhookController };