import express, { Express } from "express";
import { authRouter } from "./routes/auth";
import { accountRouter } from "./routes/account";
import { vendorRouter } from "./routes/vendor";

export const app: Express = express();
export const PORT = 4000;

app.use(express.json())

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/vendors", vendorRouter);

/**
 * POST /vendors => for creating vendor
 * 
 * GET /vendors/:vendorId => for getting a particular vendor
 * 
 * POST /vendors/:vendorId/locations => for creating location for a particular vendor
 * 
 * POST /vendors/:vendorId/closed-days => for creating closed days for a particular vendor
 * 
 * DELETE /vendors/:vendorId/closed-days/:id => for deleting a particular vendor's closed-day
 * 
 * POST /vendors/:vendorId/food => for creating a food vendor
 * 
 * POST /vendors/:vendorId/clothing => for creating a clothing vendor
 * 
 * POST /vendors/:vendorId/food/items => for creating food items
 * 
 * POST /vendors/:vendorId/clothing/products => for creating clothing item
 * 
 * POST /vendors/:vendorId/:productId/clothing/variants => for creating clothing item variants
 * 
 * POST /vendors/:vendorId/food/categories
 * POST /vendors/:vendorId/clothing/categories
 * => for creating categories
 */

