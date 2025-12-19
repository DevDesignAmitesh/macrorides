import {
  accountOTPVerifySchema,
  roles,
  zodErrorMessage,
} from "@repo/types/types";
import {
  generateToken,
  responsePlate,
  verifyOtpOrFail,
} from "../../utils";
import { Request, Response } from "express";
import { prisma } from "@repo/db/db";

export const verifyOTPService = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = accountOTPVerifySchema.safeParse({
      ...req.body,
      phone: req.params.phone,
    });
    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { phone, otp } = data;

    const existingUser = await prisma.account.findFirst({
      where: { phone },
      include: {
        customer: true,
        driver: true,
        vendorOwner: true,
      },
    });

    if (!existingUser) {
      return responsePlate({
        res,
        message: `user not exists with phone ${phone}`,
        status: 400,
      });
    }

    const ok = await verifyOtpOrFail(otp, res);
    if (!ok) return;

    const role: roles = existingUser.customer
      ? "CUSTOMER"
      : existingUser.vendorOwner
        ? "VENDOR_OWNER"
        : "DRIVER";

    const token = generateToken({ userId: existingUser.id, role: role });

    return responsePlate({
      res,
      message: `OTP verified successfully`,
      status: 201,
      data: {
        token,
      },
    });
  } catch (err) {
    console.error("registerService error", err);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
