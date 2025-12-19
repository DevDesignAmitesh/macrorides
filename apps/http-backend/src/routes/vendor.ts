import { Router } from "express";

export const vendorRouter: Router = Router();

vendorRouter.post("/");
vendorRouter.get("/:vendorId");
vendorRouter.post("/:vendorId/locations");
vendorRouter.post("/:vendorId/closed-days");
vendorRouter.post("/:vendorId/closed-days/:id");
vendorRouter.post("/:vendorId/food");
vendorRouter.post("/:vendorId/clothing");
vendorRouter.post("/:vendorId/food/items");
vendorRouter.post("/:vendorId/clothing/products");
vendorRouter.post("/:vendorId/:productId/clothing/variants");
vendorRouter.post("/:vendorId/food/categories");
vendorRouter.post("/:vendorId/clothing/categories");
