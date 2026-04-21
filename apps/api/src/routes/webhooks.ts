import express from "express";
import { Router } from "express";
import { Webhook } from "svix";
import { prisma } from "../lib/prisma";

const router: Router = Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    const wh = new Webhook(secret);
    let event: any;

    try {
      event = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
        "svix-signature": req.headers["svix-signature"] as string,
      });
    } catch {
      return res.status(400).json({ error: "Invalid signature" });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, username } = event.data;
      const email = email_addresses[0]?.email_address;

      await prisma.user.upsert({
        where: { clerk_id: id },
        update: { email },
        create: {
          clerk_id: id,
          email: email ?? "",
          username: username ?? null,
        },
      });
    }

    res.json({ received: true });
  },
);

export default router;
