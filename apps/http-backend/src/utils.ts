import { prisma } from "@repo/db/db";
import { otpStore } from "@repo/otp/otp";
import { roles } from "@repo/types/types";
import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import ImageKit from "imagekit";

export const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not found");
}

export const responsePlate = ({
  res,
  message,
  status,
  data,
}: {
  res: Response;
  message: string;
  status: number;
  data?: any;
}) => {
  return res.status(status).json({
    message,
    data,
  });
};

export async function sendOtpOrFail(phone: string, res: Response) {
  const otpResponse = await otpStore.generateOtpForPhone(phone);

  if (!otpResponse.success) {
    responsePlate({
      res,
      message: otpResponse.message ?? `failed to send OTP on ${phone}`,
      status: 400,
    });
    return false;
  }

  return true;
}

export async function verifyOtpOrFail(otp: string, res: Response) {
  const otpResponse = await otpStore.verifyAndDeletePhoneOtp(otp);

  if (!otpResponse.success) {
    responsePlate({
      res,
      message: otpResponse.message ?? `invalid otp ${otp}`,
      status: 400,
    });
    return false;
  }

  return true;
}

const roleCreateMap = {
  CUSTOMER: (tx: any, accountId: string) =>
    tx.customer.create({ data: { accountId } }),

  VENDOR_OWNER: (tx: any, accountId: string) =>
    tx.vendorOwner.create({ data: { accountId } }),
};

export async function createAccountWithRole(
  name: string,
  phone: string,
  role: "CUSTOMER" | "VENDOR_OWNER"
) {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.create({
      data: { name, phone },
    });

    const createRole = roleCreateMap[role];
    if (!createRole) throw new Error("INVALID_ROLE");

    await createRole(tx, account.id);

    return account;
  });
}

export function generateToken({
  userId,
  role,
}: {
  userId: string;
  role: roles;
}) {
  return sign({ userId, role }, JWT_SECRET!);
}

export function verifyToken({ token }: { token: string }) {
  return verify(token, JWT_SECRET!) as { userId: string; role: roles };
}

const imagekit = new ImageKit({
  publicKey: "public_SsE5cL/lvAkiOiNxANbYTlGfHoU=",
  privateKey: "private_8bjQ9EbytJ5J+q2oS5r07nJEqMI=",
  urlEndpoint: "https://ik.imagekit.io/d1l8thbvky",
});

// Type helper (same as Cloudinary)
type FileInput = Express.Multer.File | Express.Multer.File[] | null;

// Generic ImageKit upload function
export const uploadToImageKit = (
  files: FileInput,
  folderName: string = "default-folder"
): Promise<string | string[]> => {
  const uploadSingleFile = (file: Express.Multer.File): Promise<string> => {
    return new Promise(async (resolve) => {
      try {
        const uploadOptions = {
          file: file.buffer.toString("base64"),
          fileName: file.originalname,
          folder: folderName,
        };

        const result = await imagekit.upload(uploadOptions);
        resolve(result.url ?? "");
      } catch (error) {
        console.error("ImageKit upload error:", error);
        resolve("");
      }
    });
  };

  // Handle null
  if (!files) return Promise.resolve(Array.isArray(files) ? [] : "");

  // Handle single file
  if (!Array.isArray(files)) {
    return uploadSingleFile(files);
  }

  // Handle multiple files
  return Promise.all(
    files.map((file) => (file ? uploadSingleFile(file) : Promise.resolve("")))
  );
};
