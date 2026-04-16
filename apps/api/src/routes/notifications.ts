import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router: Router = Router();

router.get("/", requireAuth, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: {
      user_id: req.auth?.userId,
      is_read: false,
    },
  });
  res.json(notifications);
});

router.post("/read", requireAuth, async (req, res) => {
  const notification = await prisma.notification.updateMany({
    data: {
      is_read: true,
    },
    where: {
      user_id: req.auth?.userId,
    },
  });

  res.json({ notification: notification });
});

export default router;
