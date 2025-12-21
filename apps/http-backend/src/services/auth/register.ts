import { accountSignupSchema, zodErrorMessage } from "@repo/types/types";
import { createAccountWithRole, responsePlate } from "../../utils";
import { Request, Response } from "express";
import { prisma } from "@repo/db/db";
import { otpStore } from "@repo/otp/otp";

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

    if (existingUser && existingUser.isVerified) {
      return responsePlate({
        res,
        message: `user already exists with phone ${phone}`,
        status: 400,
      });
    }

    if (existingUser && !existingUser.isVerified) {
      const updatedUser = await prisma.account.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name,
          phone,
        },
      });

      console.log("updated user");
      console.log(updatedUser);

      const otpResponse = await otpStore.generateOtpForPhone(phone);

      if (!otpResponse.success) {
        return responsePlate({
          res,
          message:
            otpResponse.message ?? `Unable to send OTP on ${updatedUser.phone}`,
          status: 400,
        });
      }

      return responsePlate({
        res,
        message: otpResponse.message ?? `OTP sent to ${updatedUser.phone}`,
        status: 200,
      });
    }

    await createAccountWithRole(name, phone, role);

    const otpResponse = await otpStore.generateOtpForPhone(phone);
    if (!otpResponse.success) {
      return responsePlate({
        res,
        message: otpResponse.message ?? `Unable to send OTP on ${phone}`,
        status: 400,
      });
    }

    return responsePlate({
      res,
      message: otpResponse.message ?? `OTP sent to ${phone}`,
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
