import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../lib/prisma";
import { afterAll, beforeAll, describe, vi, it, expect } from "vitest";

const TEST_USER_ID = "test-user-bookmarks-01";
const TEST_NOVEL_ID = "test-novel-bookmarks-01";

vi.mock("../../middleware/auth", () => {
  return {
    requireAuth: (req: any, res: any, next: any) => {
      req.auth = {
        userId: TEST_USER_ID,
        email: "bookmarks@test.com",
        role: "USER",
      };
      next();
    },
  };
});

beforeAll(async () => {
  await prisma.user.create({
    data: {
      id: TEST_USER_ID,
      email: "bookmark@test.com",
      clerk_id: "clerk_bookmarks_test_01",
    },
  });

  await prisma.novel.create({
    data: {
      id: TEST_NOVEL_ID,
      title_original: "Bookmarks Test Novel",
      language: "CN",
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
  await prisma.bookmark.deleteMany({ where: { novel_id: TEST_NOVEL_ID } });
  await prisma.novel.delete({ where: { id: TEST_NOVEL_ID } });
  await prisma.user.delete({ where: { id: TEST_USER_ID } });
  await prisma.$disconnect;
});

describe("GET /api/bookmarks", () => {
  it("returns 200 with the user's bookmarked novels", async () => {
    const res = await request(app)
      .get("/api/bookmarks")
      .set("Authorization", "Bearer fake-token");

    expect(res.status).toBe(200);
    expect(res.body.bookmarks).toHaveLength(1);
    expect(res.body.bookmarks[0].id).toBe(TEST_NOVEL_ID);
  });

  it("returns an empty array when user has no bookmarks", async () => {
    await prisma.bookmark.deleteMany({ where: { novel_id: TEST_NOVEL_ID } });

    const res = await request(app)
      .get("/api/bookmarks")
      .set("Authorization", "Bearer fake-token");

    expect(res.status).toBe(200);
    expect(res.body.bookmarks).toHaveLength(0);

    await prisma.bookmark.create({
      data: { user_id: TEST_USER_ID, novel_id: TEST_NOVEL_ID },
    });
  });
});
