import { verifyToken } from "@clerk/backend";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();
    const token = authHeader?.split(" ")[1]!;

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload.sub) return next();

    let user = await prisma.user.findUnique({
      where: { clerk_id: payload.sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerk_id: payload.sub,
          email: (payload.email as string) ?? "",
          username: (payload.username as string) ?? payload.sub,
        },
      });
    }

    req.auth = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    next();
  }
}
