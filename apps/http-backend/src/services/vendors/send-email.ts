import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { zodErrorMessage, sendEmailSchema } from "@repo/types/types";
import { prisma } from "@repo/db/db";
import { emailStore } from "@repo/email/email";

export const sendEmailService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { data, error, success } = sendEmailSchema.safeParse({
      ...req.body,
      ...req.params,
    });

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { email, type } = data;

    const existingVendorOwner = await prisma.vendorOwner.findFirst({
      where: {
        id: userId,
      },
    });

    if (!existingVendorOwner) {
      return responsePlate({
        res,
        message: "Vendor not found",
        status: 404,
      });
    }

    const account = await prisma.account.update({
      where: {
        id: existingVendorOwner.accountId,
      },
      data: {
        email,
      },
    });

    const emailRes = await emailStore.sendEmail({
      email: account.email!,
      name: account.name,
    });

    if (!emailRes.success) {
      return responsePlate({
        res,
        message: "Unable to send email on the provided email " + email,
        status: 400,
      });
    }

    return responsePlate({
      res,
      message: "Email sent on " + email,
      status: 201,
    });
  } catch (e) {
    console.log("error in sendEmailService ", e);

    return responsePlate({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
};
