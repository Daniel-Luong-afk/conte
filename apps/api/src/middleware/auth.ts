import { Request, Response, NextFunction } from "express";

// TODO: Replace with real Clerk verification later
export function requireAuth(res: Response, req: Request, next: NextFunction) {
  if (process.env.NODE_ENV === "production") {
    res.status(401).json({ error: "Authentication Required" });
    return;
  }
  next();
}
