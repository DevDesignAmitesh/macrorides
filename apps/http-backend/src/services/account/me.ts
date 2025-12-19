import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { AccountMeResponse, roles } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const meService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const existingUser = await prisma.account.findFirst({
      where: {
        id: userId,
      },
      include: {
        customer: true,
        vendorOwner: true,
        driver: true,
      },
    });

    if (!existingUser) {
      return responsePlate({
        res,
        message: "user not found",
        status: 404,
      });
    }

    const roles: roles[] = [];

    if (existingUser.customer) {
      roles.push("CUSTOMER");
    }

    if (existingUser.vendorOwner) {
      roles.push("VENDOR_OWNER");
    }

    if (existingUser.driver) {
      roles.push("DRIVER");
    }

    const dataToReturn: AccountMeResponse = {
      id: existingUser.id,
      name: existingUser.name,
      phone: existingUser.phone,
      roles,
    };

    return responsePlate({
      res,
      message: "details found",
      status: 200,
      data: {
        details: dataToReturn,
      },
    });
  } catch (e) {
    console.log("error in meService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
