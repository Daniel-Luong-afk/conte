import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./lib/context";
import { optionalAuth } from "./middleware/optionalAuth";
import novelRestRouter from "./routes/rest";
import webhookRouter from "./routes/webhooks";
import bookmarkRouter from "./routes/bookmarks";
import notificationRouter from "./routes/notifications";
import internalRouter from "./routes/internal";
import pushRouter from "./routes/push";

dotenv.config();

export const app: Express = express();

// Security headers and parsing middleware
app.use(helmet());
app.use(cors());

// Need to put before json middleware for svix validation
app.use("/api/webhooks", webhookRouter);
app.use(express.json());

// Rate limiting
app.use("/api", apiLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(
  "/api/trpc",
  optionalAuth,
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use("/api/novels", novelRestRouter);
app.use("/api/bookmarks", bookmarkRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/internal", internalRouter);
app.use("/api/push", pushRouter);
// Error handler
app.use(errorHandler);
