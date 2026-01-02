import { Router } from "express";
import { commonMiddleware } from "../middleware/common";
import { personalDetailsService } from "../services/driver/personal-details";
import { vehicleBasicInfoService } from "../services/driver/vehicle-basic-info";
import multer from "multer";
import { vehicleDocumentationService } from "../services/driver/vehicle-documentation";
import { riderDocumentationService } from "../services/driver/rider-documentation";

export const driverRouter: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

driverRouter.post(
  "/personal-details",
  commonMiddleware,
  personalDetailsService
);
driverRouter.post(
  "/vehicle-basic-info",
  commonMiddleware,
  vehicleBasicInfoService
);
driverRouter.post(
  "/vehicle-documentation/:documentId",
  upload.fields([
    {
      name: "insurance",
      maxCount: 1,
    },
    {
      name: "rc",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  commonMiddleware,
  vehicleDocumentationService
);
driverRouter.post(
  "/rider-documentation",
  upload.fields([
    {
      name: "license",
      maxCount: 1,
    },
    {
      name: "aadhaarCard",
      maxCount: 1,
    },
    {
      name: "vehicleOwnerShipProof",
      maxCount: 1,
    },
  ]),
  commonMiddleware,
  riderDocumentationService
);
