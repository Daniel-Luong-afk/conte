import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { prisma } from "../lib/prisma";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1]!;

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload?.sub) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { clerk_id: payload.sub },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.auth = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}
