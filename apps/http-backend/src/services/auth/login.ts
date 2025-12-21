import { accountSigninSchema, zodErrorMessage } from "@repo/types/types";
import { responsePlate } from "../../utils";
import { Request, Response } from "express";
import { prisma } from "@repo/db/db";
import { otpStore } from "@repo/otp/otp";

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

    const otpResponse = await otpStore.generateOtpForPhone(phone);
    if (!otpResponse.success) {
      return responsePlate({
        res,
        message:
          otpResponse.message ?? `Unable to send OTP on ${existingUser.phone}`,
        status: 400,
      });
    }

    console.log(otpResponse);
    return responsePlate({
      res,
      message: otpResponse.message ?? `OTP sent to ${existingUser.phone}`,
      status: 200,
    });
  } catch (err) {
    console.error("loginService error", err);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
