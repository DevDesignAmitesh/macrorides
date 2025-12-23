import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { vendorCreateSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createVendorService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    console.log("this is the tokenzied data of the user");
    console.log(req.user);
    const { success, error, data } = vendorCreateSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const {
      contactNumber,
      outletName,
      type,
      gstNumber,
      aadhaarNumber,
      panNumber,
    } = data;

    const existingVendor = await prisma.vendor.findFirst({
      where: {
        contactNumber,
      },
    });

    if (existingVendor && existingVendor.isVerified) {
      return responsePlate({
        res,
        message: "vendor already exists with the given details",
        status: 400,
      });
    }

    if (existingVendor && !existingVendor.isVerified) {
      return responsePlate({
        res,
        message: "vendor created successfully",
        status: 200,
        data: {
          vendorId: existingVendor.id,
        },
      });
    }

    let vendorId: string = "";

    await prisma.$transaction(async (tx) => {
      const vendor = await tx.vendor.create({
        data: {
          ownerId: userId,
          contactNumber,
          outletName,
          type,
          gstNumber,
        },
      });

      vendorId = vendor.id;

      const account = await prisma.account.findFirst({
        where: {
          vendorOwner: {
            id: userId,
          },
        },
      });

      if (!account) {
        throw new Error("Something went wrong");
      }

      await tx.vendorOwner.update({
        where: {
          accountId: account.id,
        },
        data: {
          aadhaarNumber,
          panNumber,
        },
      });
    });

    return responsePlate({
      res,
      message: "vendor created successfully",
      status: 201,
      data: {
        vendorId,
      },
    });
  } catch (e) {
    console.log("error in createVendorService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
