import { Router } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import webpush from "web-push";
import { title } from "process";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const internal_secret = process.env.INTERNAL_SECRET;
const router: Router = Router();

router.post("/chapter-done", async (req, res) => {
  const internal_secret_header = req.headers["x-internal-secret"];

  if (!internal_secret_header || internal_secret_header !== internal_secret) {
    res.status(401).json("Incorrect header");
    return;
  }

  const { novel_id, novel_title, chapter_number } = req.body;

  if (!novel_id) {
    res.status(404).json("Couldn't find novel with that ID");
    return;
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      novel_id: novel_id,
    },
  });

  const notification = bookmarks.map((b) => ({
    user_id: b.user_id,
    novel_id: b.novel_id,
    message: `${novel_title} has a new chapter: ${chapter_number}`,
  }));

  const { count } = await prisma.notification.createMany({
    data: notification,
  });

  const push_subscription = await prisma.pushSubscription.findMany({
    where: {
      user_id: {
        in: bookmarks.map((bookmark) => bookmark.user_id),
      },
    },
  });

  let push_promises = [];
  for (let subscriber of push_subscription) {
    push_promises.push(
      webpush.sendNotification(
        {
          endpoint: subscriber.endpoint,
          keys: { p256dh: subscriber.p256dh, auth: subscriber.auth },
        },
        JSON.stringify({
          title: "Conte: New Chapter",
          body: "There is a new chapter for the bookmarked novel",
        }),
      ),
    );
  }
  Promise.allSettled(push_promises);

  await redis.del("novels:all", `novels:${novel_id}`);

  res.json({ count: count });
});

export default router;
