import { Router } from "express";
import { verifyClerkWebhook } from "../middlewares/clerk.middleware";
import { clerkWebhookController } from "../controllers/clerk.controllers";

const router = Router();

// Example route for clerk
router.route("/webhooks/register").post(verifyClerkWebhook, clerkWebhookController)

export default router;