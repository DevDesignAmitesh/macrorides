import { accountSigninSchema, zodErrorMessage } from "@repo/types/types";
import {
  responsePlate,
  sendOtpOrFail,
} from "../../utils";
import { Request, Response } from "express";
import { prisma } from "@repo/db/db";

export const loginService = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = accountSigninSchema.safeParse(req.body);
    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { phone } = data;

    const existingUser = await prisma.account.findFirst({ where: { phone } });

    if (!existingUser) {
      return responsePlate({
        res,
        message: `user not exists with phone ${phone}`,
        status: 400,
      });
    }

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
