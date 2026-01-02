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

import z, { ZodError } from "zod";

export type kitchenState = "OPEN" | "CLOSED" | "KITCHEN_BUSY" | "";
export type vendorType = "FOOD" | "CLOTHING";
export type operationalState = "OPEN" | "CLOSED" | "MAINTENANCE" | "";
export type locationLabel = "HOME" | "WORK" | "OUTLET" | "PICKUP" | "DROP";

export type Notify = {
  success: (msg: string) => void;
  error: (msg: string) => void;
};

export type useCreateRoleBasedVendorProps =
  | {
      input: FoodVendorCreateOrUpdateInput;
      type: "FOOD" | "";
    }
  | {
      input: ClothVendorCreateOrUpdateInput;
      type: "CLOTHING" | "";
    };

export const HTTP_BACKEND_DEV_URL = "http://localhost:4000/api/v1";
export const HTTP_BACKEND_PROD_URL =
  "https://macrorides-http-backend.vercel.app/api/v1";

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
  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid 10-digit Indian number"
    ),
  name: z.string().min(3, "name is too short"),

  // From vendor portal always send "VENDOR_OWNER"
  role: z.enum(["CUSTOMER", "VENDOR_OWNER", "DRIVER"]),
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
  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid 10-digit Indian number"
    ),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
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
  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid 10-digit Indian number"
    ),
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
 *  POST
 *   /vendor/personal-details
 */

export type gender = "MALE" | "FEMALE" | "OTHER";

export const personalDetailsSchema = z.object({
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  isPolicyAccepted: z.boolean(),
});

/**
 * POST
 * /vendors/vehicle-basic-info
 */
export type vehicleType = "TWO_WHEELER" | "THREE_WHEELER" | "FOUR_WHEELER";
export type vehicleOwnershipStatus = "OWNED" | "RENTED";

export const vehicleBasicInfoSchema = z.object({
  registrationNumber: z.string(),
  color: z.string(),
  identificationNumber: z.string().optional(),
  rcNumber: z.string(),
  range: z.string(),
  type: z.enum(["TWO_WHEELER", "THREE_WHEELER", "FOUR_WHEELER"]),
  ownershipStatus: z.enum(["OWNED", "RENTED"]),
  isElectric: z.boolean(),
});

/**
 * POST
 * /vendors/bank-details
 */

export const bankDetailsSchema = z.object({
  accountHolderName: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
});

/**
 * POST
 * /vendors/email:type
 *
 */
export type sendEmailType = "VENDOR_ONBOARDING_CONFIRMATION"; // more in future

export const sendEmailSchema = z.object({
  email: z.email(),
  type: z.enum(["VENDOR_ONBOARDING_CONFIRMATION"]),
});

export interface SendEmailInput {
  email: string;
  type: sendEmailType;
}

/**
 * POST /vendors
 * TOKEN: ✅ REQUIRED
 */
export const vendorCreateSchema = z.object({
  outletName: z.string(),
  type: z.enum(["FOOD", "CLOTHING"]), // FOOD | CLOTHING
  gstNumber: z.string().optional(),
  panNumber: z.string(),
  aadhaarNumber: z.string(),
  contactNumber: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Contact number must be a valid 10-digit Indian number"
    ),
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
    address: z.string().min(10, "address is too short"),
    label: z.enum(["HOME", "WORK", "OUTLET", "PICKUP", "DROP"]),
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
  kitchenState: z.enum(["OPEN", "CLOSED", "KITCHEN_BUSY"]),
  openingTime: z.string().optional(), // ISO string
  closingTime: z.string().optional(), // ISO string
  is247: z.boolean().optional(),
});

/**
 * POST /vendors/:vendorId/food/items
 * TOKEN: ✅ REQUIRED
 */
export const createFoodItemSchema = z.object({
  vendorId: z.uuid(), // from URL params
  name: z.string().min(4, "item name is too short"),
  description: z.string().min(20, "item description is too short"),
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
  operationalState: z.enum(["OPEN", "CLOSED", "MAINTAINANCE"]),
});

/**
 * POST /vendors/:vendorId/clothing/products
 * TOKEN: ✅ REQUIRED
 */
export const createClothingProductSchema = z.object({
  vendorId: z.uuid(), // from URL params
  name: z.string().min(4, "item name is too short"),
  description: z.string().min(20, "item description is too short"),
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

// MAP TYPES
// /maps/suggestions/:input
export const suggestionSchema = z.object({
  input: z.string().min(3),
});

export interface SendMapDataToUser {
  title: string;
  shortDesc: string;
  longDesc: string;
  lat: number;
  lng: number;
}

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
  type: "FOOD" | "CLOTHING" | "";
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
  openingTime: ISODateString | undefined;
  closingTime: ISODateString | undefined;
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
  closedDays: string[];
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
  kitchenState: kitchenState;
  openingTime: ISODateString | undefined;
  closingTime: ISODateString | undefined;
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
  operationalState: operationalState;
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
  name: string[];
  type: vendorType | "";
}
