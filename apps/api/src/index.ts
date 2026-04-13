import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./lib/context";
import { optionalAuth } from "./middleware/optionalAuth";
import novelRestRouter from "./routers/rest";
import webhookRouter from "./routes/webhooks";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
