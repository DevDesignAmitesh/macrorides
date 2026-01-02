import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { personalDetailsSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const personalDetailsService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { success, data, error } = personalDetailsSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { gender, isPolicyAccepted } = data;

    const account = await prisma.account.findFirst({
      where: {
        id: userId,
      },
      include: {
        driver: true,
      },
    });

    if (!account) {
      return responsePlate({
        res,
        message: "Account not found",
        status: 404,
      });
    }

    if (!account.driver) {
      return responsePlate({
        res,
        message: "ONLY for drivers",
        status: 403,
      });
    }

    await prisma.driverPersonalDetails.create({
      data: {
        driverId: account.driver.id,
        gender,
        isPolicyAccepted,
      },
    });

    return responsePlate({
      res,
      message: "Personal details added",
      status: 201,
    });
  } catch (e) {
    console.log("error in personalDetailsService ", e);
    return responsePlate({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
};
