import { Router } from "express";
import multer from "multer";
import { createVendorService } from "../services/vendors/create-vendor";
import { commonMiddleware } from "../middleware/common";
import { getVendorService } from "../services/vendors/get-vendor";
import { createLocationService } from "../services/vendors/create-location";
import { createClosedDaysService } from "../services/vendors/create-closed-days";
import { deleteClosedDayService } from "../services/vendors/delete-closed-day";
import { createFoodItemService } from "../services/vendors/create-food-item";
import { createClothItemService } from "../services/vendors/create-cloth-item";

export const vendorRouter: Router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// doubt between common or only vendor middleware or more than two roles middleware
vendorRouter.post("/", commonMiddleware, createVendorService);
vendorRouter.get("/:vendorId", commonMiddleware, getVendorService);
vendorRouter.post(
  "/:vendorId/locations",
  commonMiddleware,
  createLocationService
);
vendorRouter.post(
  "/:vendorId/closed-days",
  commonMiddleware,
  createClosedDaysService
);
vendorRouter.post(
  "/:vendorId/closed-days/:id",
  commonMiddleware,
  deleteClosedDayService
);

// this should be only available for vendortype FOOD
vendorRouter.post(
  "/:vendorId/food/items",
  commonMiddleware,
  upload.single("foodImages"),
  createFoodItemService
);

// this should be only available for vendorType CLOTHING
vendorRouter.post(
  "/:vendorId/clothing/products",
  commonMiddleware,
  upload.single("clothImages"),
  createClothItemService
);

// this will create food vendor
vendorRouter.post("/:vendorId/food");

// this will create clothing vendor
vendorRouter.post("/:vendorId/clothing");

// this will create clothing variants
vendorRouter.post("/:vendorId/:productId/clothing/variants");

// these both will create categories
vendorRouter.post("/:vendorId/food/categories");
vendorRouter.post("/:vendorId/clothing/categories");
