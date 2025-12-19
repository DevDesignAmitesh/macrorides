import express, { Express } from "express";
import { authRouter } from "./routes/auth";
import { accountRouter } from "./routes/account";
import { vendorRouter } from "./routes/vendor";

export const app: Express = express();
export const PORT = 4000;

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/vendors", vendorRouter);
