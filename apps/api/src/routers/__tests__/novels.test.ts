import { describe, it, expect, vi, beforeEach } from "vitest";
import { novelsRouter } from "../novels";

function createMockCtx(userId?: string) {
  return {
    userId: userId ?? null,
    prisma: {
      novel: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      bookmark: {
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
}

describe("novelsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("toggleBookmark", () => {
    it("creates a bookmark where none exists", async () => {
      const ctx = createMockCtx("user-123");
      const caller = novelsRouter.createCaller(ctx as any);

      ctx.prisma.bookmark.findUnique.mockResolvedValue(null);
      ctx.prisma.bookmark.create.mockResolvedValue({
        id: "bm-1",
        user_id: "user-123",
        novel_id: "novel-456",
      });

      const result = await caller.toggleBookmark({ novelId: "novel-456" });

      expect(result).toEqual({ bookmarked: true });
      expect(ctx.prisma.bookmark.create).toHaveBeenCalledTimes(1);
      expect(ctx.prisma.bookmark.delete).not.toHaveBeenCalled();
    });

    it("deletes a bookmark when one already exists", async () => {
      const ctx = createMockCtx("user-123");
      const caller = novelsRouter.createCaller(ctx as any);

      ctx.prisma.bookmark.findUnique.mockResolvedValue({
        id: "bm-1",
        user_id: "user-123",
        novel_id: "novel-456",
      });
      ctx.prisma.bookmark.delete.mockResolvedValue({
        id: "bm-1",
        user_id: "user-123",
        novel_id: "novel-456",
      });

      const result = await caller.toggleBookmark({ novelId: "novel-456" });

      expect(result).toEqual({ bookmarked: false });
      expect(ctx.prisma.bookmark.delete).toHaveBeenCalledTimes(1);
      expect(ctx.prisma.bookmark.create).not.toHaveBeenCalled();
    });
  });

  describe("isBookmarked", () => {
    it("returns false when no bookmark exists", async () => {
      const ctx = createMockCtx("user-123");
      const caller = novelsRouter.createCaller(ctx as any);

      ctx.prisma.bookmark.findUnique.mockResolvedValue(null);

      const result = await caller.isBookmarked({ novelId: "novel-456" });

      expect(result).toEqual({ bookmarked: false });
    });

    it("return true when bookmark exists", async () => {
      const ctx = createMockCtx("user-123");
      const caller = novelsRouter.createCaller(ctx as any);

      ctx.prisma.bookmark.findUnique.mockResolvedValue({
        id: "bm-1",
        user_id: "user-123",
        novel_id: "novel-456",
      });

      const result = await caller.isBookmarked({ novelId: "novel-456" });

      expect(result).toEqual({ bookmarked: true });
    });
  });
});
