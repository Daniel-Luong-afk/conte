import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router: Router = Router();

router.post("/subscribe", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const { endpoint, keys } = req.body;
  const { p256dh, auth } = keys;

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {},
    create: { user_id: userId, endpoint: endpoint, p256dh: p256dh, auth: auth },
  });

  res.json({ ok: true });
});

router.delete("/subscribe", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const { endpoint } = req.body;

  await prisma.pushSubscription.deleteMany({
    where: { endpoint: endpoint, user_id: userId },
  });

  res.json({ ok: true });
});

export default router;
