import request from "supertest";
import { app } from "../../app";
import { describe, it, expect } from "vitest";

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("includes a timestamp in the response", async () => {
    const res = await request(app).get("/health");
    expect(res.body.timestamp).toBeDefined();
  });
});
