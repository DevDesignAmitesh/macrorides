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
import { createClothVariantSchema } from "../services/vendors/create-cloth-variant";
import { createCategoriesService } from "../services/vendors/create-categories";
import { createFoodVendorService } from "../services/vendors/create-food-vendor";
import { createClothingVendorService } from "../services/vendors/create-clothing-vendor";

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

// this will create clothing variants
vendorRouter.post(
  "/:vendorId/:productId/clothing/variants",
  commonMiddleware,
  createClothVariantSchema
);

// this will create food vendor
vendorRouter.post("/:vendorId/food", commonMiddleware, createFoodVendorService);

// this will create clothing vendor
vendorRouter.post(
  "/:vendorId/clothing",
  commonMiddleware,
  createClothingVendorService
);

// this will create categories for both food or clothing
vendorRouter.post(
  "/:vendorId/categories",
  commonMiddleware,
  createCategoriesService
);
