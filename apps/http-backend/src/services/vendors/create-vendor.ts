import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { vendorCreateSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createVendorService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { success, error, data } = vendorCreateSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { aadhaarNumber, contactNumber, outletName, panNumber, type } = data;

    const existingVendor = await prisma.vendor.findFirst({
      where: {
        OR: [{ aadhaarNumber }, { contactNumber }, { panNumber }],
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
        status: 201,
        data: {
          vendorId: existingVendor.id,
        },
      });
    }

    await prisma.vendor
      .create({
        data: {
          ownerId: userId,
          aadhaarNumber,
          contactNumber,
          outletName,
          panNumber,
          type,
        },
      })
      .then((data) => {
        return responsePlate({
          res,
          message: "vendor created successfully",
          status: 201,
          data: {
            vendorId: data.id,
          },
        });
      })
      .catch((e) => {
        console.log("error while creating vendor in createVendorService ", e);

        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
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
