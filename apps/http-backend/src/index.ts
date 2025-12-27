import "dotenv/config";
import express, { Express } from "express";
import { authRouter } from "./routes/auth";
import { accountRouter } from "./routes/account";
import { vendorRouter } from "./routes/vendor";
import cors from "cors";
import { mapRouter } from "./routes/map";

export const app: Express = express();
export const PORT = 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://partners.macrorides.com",
      "https://partners.macrorides.in",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/vendors", vendorRouter);
app.use("/api/v1/maps", mapRouter);

app.get("/api/health", (_req, res) => {
  res.send("good hai");
});

export default app;