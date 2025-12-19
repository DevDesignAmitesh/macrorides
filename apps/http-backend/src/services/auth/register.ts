import { accountSignupSchema, zodErrorMessage } from "@repo/types/types";
import {
  createAccountWithRole,
  responsePlate,
  sendOtpOrFail,
} from "../../utils";
import { Request, Response } from "express";
import { prisma } from "@repo/db/db";

export const registerService = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = accountSignupSchema.safeParse(req.body);
    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { name, phone, role } = data;

    const existingUser = await prisma.account.findFirst({ where: { phone } });

    if (existingUser?.isVerified) {
      return responsePlate({
        res,
        message: `user already exists with phone ${phone}`,
        status: 400,
      });
    }

    if (existingUser && !existingUser.isVerified) {
      const ok = await sendOtpOrFail(phone, res);
      if (!ok) return;
      return responsePlate({
        res,
        message: `OTP sent to ${phone}`,
        status: 200,
      });
    }

    await createAccountWithRole(name, phone, role);

    const ok = await sendOtpOrFail(phone, res);
    if (!ok) return;

    return responsePlate({
      res,
      message: `OTP sent to ${phone}`,
      status: 201,
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
