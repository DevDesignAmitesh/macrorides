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

import z from "zod";
import {
  kitchenState,
  vendorType,
  operationalState,
  locationLabel,
} from "@repo/db/db";

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

/* ============================================================
   VENDOR LOCATION
   ============================================================ */

/**
 * POST /vendors/:vendorId/locations
 * TOKEN: ✅ REQUIRED
 */
export const createLocationSchema = z.object({
  vendorId: z.uuid(), // from URL params
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  label: z.enum(locationLabel),
});

/* ============================================================
   VENDOR CLOSED DAYS
   ============================================================ */

/**
 * POST /vendors/:vendorId/closed-days
 * TOKEN: ✅ REQUIRED
 */
export const createClosedDaySchema = z.object({
  vendorId: z.uuid(), // from URL params
  closedDays: z.array(
    z.object({
      day: z.string(), // e.g. MONDAY
    })
  ),
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
  openingTime: z.string().datetime(), // ISO string
  closingTime: z.string().datetime(), // ISO string
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
  imageUrl: z.url(),
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
export const createClothingVariantsSchema = z.object({
  vendorId: z.uuid(), // from URL params
  productId: z.uuid(), // from URL params
  size: z.string(),
  color: z.string(),
  price: z.number(),
  stockQty: z.number(),
});

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
  name: z.string(),
});
