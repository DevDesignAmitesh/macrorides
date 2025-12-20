/**
 * ============================================================
 * API HANDOVER – VENDOR ONBOARDING & INVENTORY
 * ============================================================
 *
 * - All APIs use JSON
 * - All authenticated APIs require Authorization: Bearer <token>
 * - vendorId / productId are sent via URL params
 *   (kept in body schema only for reference)
 * - Date & time must be sent as ISO strings
 *
 * ============================================================
 */

import "dotenv/config";
import z, { ZodError } from "zod";
import {
  kitchenState,
  vendorType,
  operationalState,
  locationLabel,
} from "@repo/db/db";

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV not found");
}

export type Notify = {
  success: (msg: string) => void;
  error: (msg: string) => void;
};

export const HTTP_URL =
  process.env.NODE_ENV === "production"
    ? "http://wrong:4000/api/v1"
    : "http://localhost:4000/api/v1";

export type roles = "CUSTOMER" | "VENDOR_OWNER" | "DRIVER";

export const zodErrorMessage = ({ error }: { error: ZodError }) => {
  return error.issues
    .map((er) => `${er.path.join(".")}: ${er.message}`)
    .join(", ");
};

/* ============================================================
   AUTH MODULE
   ============================================================ */

/**
 * POST /auth/register
 * TOKEN: ❌ NOT REQUIRED
 */
export const accountSignupSchema = z.object({
  phone: z.string(),
  name: z.string(),

  // From vendor portal always send "VENDOR_OWNER"
  role: z.enum(["CUSTOMER", "VENDOR_OWNER"]),
});

/**
 * RESPONSE
 * {
 *   message: "OTP has been sent successfully"
 * }
 *
 * OR
 *
 * {
 *   message: "User already exists with this phone number"
 * }
 */

/**
 * POST /auth/verify-otp
 * TOKEN: ❌ NOT REQUIRED
 */
export const accountOTPVerifySchema = z.object({
  phone: z.string(),
  otp: z.string(),
});

/**
 * RESPONSE
 * { message: "Invalid OTP" }
 * { message: "OTP already verified" }
 *
 * SUCCESS
 * {
 *   message: "OTP verified successfully",
 *   data: {
 *     token: "JWT_TOKEN" // store in localStorage
 *   }
 * }
 */

/**
 * POST /auth/login
 * TOKEN: ❌ NOT REQUIRED
 */
export const accountSigninSchema = z.object({
  phone: z.string(),
});

/**
 * RESPONSE
 * {
 *   message: "OTP has been sent successfully"
 * }
 */

/* ============================================================
   ACCOUNT MODULE
   ============================================================ */

/**
 * GET /account/me
 * TOKEN: ✅ REQUIRED
 *
 * RESPONSE
 * {
 *   id: string,
 *   name: string,
 *   phone: string,
 *   roles: ["VENDOR_OWNER"]
 * }
 */

/* ============================================================
   VENDOR MODULE
   ============================================================ */

/**
 * POST /vendors
 * TOKEN: ✅ REQUIRED
 */
export const vendorCreateSchema = z.object({
  outletName: z.string(),
  type: z.enum(vendorType), // FOOD | CLOTHING
  gstNumber: z.string().optional(),
  panNumber: z.string(),
  aadhaarNumber: z.string(),
  contactNumber: z.string(),
});

/**
 * RESPONSE
 * {
 *   message: "Vendor created successfully",
 *   data: {
 *     vendorId: "uuid"
 *   }
 * }
 */

/**
 * GET /vendors/:vendorId
 * TOKEN: ✅ REQUIRED
 */
export const getVendorSchema = z.object({
  vendorId: z.uuid(), // from URL params
});

/**
 * RESPONSE

{
  message: "Vendor fetched successfully",
  data: {
    id: string,
    outletName: string,
    type: "FOOD" | "CLOTHING",
    isVerified: boolean,

    contactNumber: string,

    gstNumber?: string,
    panNumber: string,
    aadhaarNumber: string,

    owner: {
      id: string,
      accountId: string,
    },

    locations: [
      {
        id: string,
        latitude: number,
        longitude: number,
        address: string,
        label: "OUTLET" | "PICKUP",
        contactPhone: string,
      }
    ],

    closedDays: [
      {
        id: string,
        day: string, // MONDAY
      }
    ],

    foodVendor?: {
      fssaiNumber: string,
      kitchenState: "OPEN" | "CLOSED" | "KITCHEN_BUSY",
      openingTime: string, // ISO
      closingTime: string, // ISO
      is247: boolean,
    },

    clothVendor?: {
      returnPolicy: string,
      operationalState: "OPEN" | "CLOSED" | "MAINTAINANCE",
    },

    createdAt: string,
    updatedAt: string,
  }
}
 */

/* ============================================================
   VENDOR LOCATION
   ============================================================ */

/**
 * POST /vendors/:vendorId/locations
 * TOKEN: ✅ REQUIRED
 */
export const createLocationSchema = z.array(
  z.object({
    vendorId: z.uuid(), // from URL params
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
    label: z.enum(locationLabel),
  })
);

/* ============================================================
   VENDOR CLOSED DAYS
   ============================================================ */

/**
 * POST /vendors/:vendorId/closed-days
 * TOKEN: ✅ REQUIRED
 */
export const createClosedDaySchema = z.object({
  vendorId: z.uuid(), // from URL params
  closedDays: z.array(z.string()),
});

/**
 * DELETE /vendors/:vendorId/closed-days/:id
 * TOKEN: ✅ REQUIRED
 */
export const deleteClosedDaySchema = z.object({
  vendorId: z.uuid(), // from URL params
  closingDayId: z.uuid(), // from URL params
});

/* ============================================================
   FOOD VENDOR
   ============================================================ */

/**
 * POST /vendors/:vendorId/food
 * TOKEN: ✅ REQUIRED
 */
export const foodVendorCreateOrUpdateSchema = z.object({
  vendorId: z.uuid(), // from URL params
  fssaiNumber: z.string(),
  kitchenState: z.enum(kitchenState),
  openingTime: z.iso.datetime(), // ISO string
  closingTime: z.iso.datetime(), // ISO string
  is247: z.boolean(),
});

/**
 * POST /vendors/:vendorId/food/items
 * TOKEN: ✅ REQUIRED
 */
export const createFoodItemSchema = z.object({
  vendorId: z.uuid(), // from URL params
  name: z.string(),
  description: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
});

/* ============================================================
   CLOTHING VENDOR
   ============================================================ */

/**
 * POST /vendors/:vendorId/clothing
 * TOKEN: ✅ REQUIRED
 */
export const clothVendorCreateOrUpdateSchema = z.object({
  vendorId: z.uuid(), // from URL params
  returnPolicy: z.string(),
  operationalState: z.enum(operationalState),
});

/**
 * POST /vendors/:vendorId/clothing/products
 * TOKEN: ✅ REQUIRED
 */
export const createClothingProductSchema = z.object({
  vendorId: z.uuid(), // from URL params
  name: z.string(),
  description: z.string(),
  brand: z.string(),
});

/**
 * POST /vendors/:vendorId/:productId/clothing/variants
 * TOKEN: ✅ REQUIRED
 */
export const createClothingVariantsSchema = z.array(
  z.object({
    vendorId: z.uuid(), // from URL params
    productId: z.uuid(), // from URL params
    size: z.string(),
    color: z.string(),
    price: z.number(),
    stockQty: z.number(),
  })
);

/* ============================================================
   CATEGORIES (FOOD & CLOTHING)
   ============================================================ */

/**
 * POST /vendors/:vendorId/food/categories
 * POST /vendors/:vendorId/clothing/categories
 * TOKEN: ✅ REQUIRED
 */
export const createCategoriesSchema = z.object({
  vendorId: z.uuid(), // from URL params
  name: z.array(z.string()),
});

/* ============================================================
   COMMON TYPES
   ============================================================ */

export type UUID = string;
export type ISODateString = string;

/* ============================================================
   AUTH MODULE
   ============================================================ */

/** POST /auth/register */
export interface AccountSignupInput {
  phone: string;
  name: string;
  role: "CUSTOMER" | "VENDOR_OWNER";
}

export interface AuthMessageResponse {
  message: string;
}

/** POST /auth/verify-otp */
export interface AccountOTPVerifyInput {
  phone: string;
  otp: string;
}

export interface OTPVerifySuccessResponse {
  message: string;
  data: {
    token: string;
  };
}

/** POST /auth/login */
export interface AccountSigninInput {
  phone: string;
}

/* ============================================================
   ACCOUNT MODULE
   ============================================================ */

/** GET /account/me */
export interface AccountMeResponse {
  id: UUID;
  name: string;
  phone: string;
  roles: Array<roles>;
}

/* ============================================================
   VENDOR MODULE
   ============================================================ */

/** POST /vendors */
export interface VendorCreateInput {
  outletName: string;
  type: "FOOD" | "CLOTHING";
  gstNumber?: string;
  panNumber: string;
  aadhaarNumber: string;
  contactNumber: string;
}

export interface VendorCreateResponse {
  message: string;
  data: {
    vendorId: UUID;
  };
}

/** GET /vendors/:vendorId */
export interface GetVendorParams {
  vendorId: UUID; // URL param
}

/* ============================================================
   VENDOR RESPONSE SHAPE
   ============================================================ */

export interface VendorLocation {
  id: UUID;
  latitude: number;
  longitude: number;
  address: string;
  label: "HOME" | "WORK" | "OUTLET" | "PICKUP" | "DROP";
  contactPhone: string;
}

export interface VendorClosedDay {
  id: UUID;
  day: string; // MONDAY, SUNDAY, etc.
}

export interface FoodVendorDetails {
  fssaiNumber: string;
  kitchenState: "OPEN" | "CLOSED" | "KITCHEN_BUSY";
  openingTime: ISODateString;
  closingTime: ISODateString;
  is247: boolean;
}

export interface ClothVendorDetails {
  returnPolicy: string;
  operationalState: "OPEN" | "CLOSED" | "MAINTAINANCE";
}

export interface VendorResponse {
  id: UUID;
  outletName: string;
  type: "FOOD" | "CLOTHING";
  isVerified: boolean;

  contactNumber: string;

  gstNumber?: string | null;
  panNumber: string;
  aadhaarNumber: string;

  owner: {
    id: UUID;
    accountId: UUID;
  };

  locations: VendorLocation[];
  closedDays: VendorClosedDay[];

  foodVendor?: FoodVendorDetails | null;
  clothVendor?: ClothVendorDetails | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/* ============================================================
   VENDOR LOCATION
   ============================================================ */

/** POST /vendors/:vendorId/locations */
export interface CreateVendorLocationInput {
  vendorId: UUID; // URL param
  latitude: number;
  longitude: number;
  address: string;
  label: "HOME" | "WORK" | "OUTLET" | "PICKUP" | "DROP";
}

/* ============================================================
   VENDOR CLOSED DAYS
   ============================================================ */

/** POST /vendors/:vendorId/closed-days */
export interface CreateClosedDayInput {
  vendorId: UUID; // URL param
  closedDays: {
    day: string;
  }[];
}

/** DELETE /vendors/:vendorId/closed-days/:id */
export interface DeleteClosedDayInput {
  vendorId: UUID; // URL param
  closingDayId: UUID; // URL param
}

/* ============================================================
   FOOD VENDOR
   ============================================================ */

/** POST /vendors/:vendorId/food */
export interface FoodVendorCreateOrUpdateInput {
  vendorId: UUID; // URL param
  fssaiNumber: string;
  kitchenState: "OPEN" | "CLOSED" | "KITCHEN_BUSY";
  openingTime: ISODateString;
  closingTime: ISODateString;
  is247: boolean;
}

/** POST /vendors/:vendorId/food/items */
export interface CreateFoodItemInput {
  vendorId: UUID; // URL param
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  isAvailable: boolean;
}

/* ============================================================
   CLOTHING VENDOR
   ============================================================ */

/** POST /vendors/:vendorId/clothing */
export interface ClothVendorCreateOrUpdateInput {
  vendorId: UUID; // URL param
  returnPolicy: string;
  operationalState: "OPEN" | "CLOSED" | "MAINTAINANCE";
}

/** POST /vendors/:vendorId/clothing/products */
export interface CreateClothingProductInput {
  vendorId: UUID; // URL param
  name: string;
  description: string;
  brand: string;
}

/** POST /vendors/:vendorId/:productId/clothing/variants */
export interface CreateClothingVariantInput {
  vendorId: UUID; // URL param
  productId: UUID; // URL param
  size: string;
  color: string;
  price: number;
  stockQty: number;
}

/* ============================================================
   CATEGORIES
   ============================================================ */

/**
 * POST /vendors/:vendorId/food/categories
 * POST /vendors/:vendorId/clothing/categories
 */
export interface CreateCategoryInput {
  vendorId: UUID; // URL param
  name: string;
}
