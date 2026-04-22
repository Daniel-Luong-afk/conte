import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../lib/prisma";

const INTERNAL_SECRET = process.env.INTERNAL_SECRET!;

const TEST_USER_ID = "test-user-intergration-01";
const TEST_NOVEL_ID = "test-novel-intergration-01";

beforeAll(async () => {
  await prisma.user.create({
    data: {
      id: TEST_USER_ID,
      email: "intergration@test.com",
      clerk_id: "clerk_intergration_test_01",
    },
  });

  await prisma.novel.create({
    data: {
      id: TEST_NOVEL_ID,
      title_original: "Test Novel",
      language: "JP",
    },
  });

  await prisma.bookmark.create({
    data: {
      user_id: TEST_USER_ID,
      novel_id: TEST_NOVEL_ID,
    },
  });
});

afterAll(async () => {
  await prisma.notification.deleteMany({ where: { user_id: TEST_USER_ID } });
  await prisma.bookmark.deleteMany({ where: { novel_id: TEST_NOVEL_ID } });
  await prisma.novel.delete({ where: { id: TEST_NOVEL_ID } });
  await prisma.user.delete({ where: { id: TEST_USER_ID } });
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.notification.deleteMany({ where: { user_id: TEST_USER_ID } });
});

describe("POST /api/internal/chapter-done", () => {
  it("returns 401 when internal secret header is missing", async () => {
    const res = await request(app).post("/api/internal/chapter-done").send({
      novel_id: TEST_NOVEL_ID,
      novel_title: "Test Novel",
      chapter_number: 1,
    });

    expect(res.status).toBe(401);
  });

  it("returns 401 when internal secret header is wrong", async () => {
    const res = await request(app)
      .post("/api/internal/chapter-done")
      .set("x-internal-secret", "wrong-secret")
      .send({
        novel_id: TEST_NOVEL_ID,
        novel_title: "Test Novel",
        chapter_number: 1,
      });

    expect(res.status).toBe(401);
  });

  it("creates one notification per bookmark and returns the count", async () => {
    const res = await request(app)
      .post("/api/internal/chapter-done")
      .set("x-internal-secret", INTERNAL_SECRET)
      .send({
        novel_id: TEST_NOVEL_ID,
        novel_title: "Test Novel",
        chapter_number: 5,
      });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);

    const notifications = await prisma.notification.findMany({
      where: { user_id: TEST_USER_ID },
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0]?.message).toContain("chapter: 5");
  });

  it("returns 404 when novel_id is missing from the body", async () => {
    const res = await request(app)
      .post("/api/internal/chapter-done")
      .set("x-internal-secret", INTERNAL_SECRET)
      .send({});

    expect(res.status).toBe(404);
  });
});
