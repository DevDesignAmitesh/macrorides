import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import {
  foodVendorCreateOrUpdateSchema,
  zodErrorMessage,
} from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createFoodVendorService = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = foodVendorCreateOrUpdateSchema.safeParse({
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

    const {
      closingTime,
      openingTime,
      fssaiNumber,
      is247,
      kitchenState,
      vendorId,
    } = data;

    await prisma.$transaction(async (tx) => {
      await tx.foodVendor.create({
        data: {
          fssaiNumber,
          kitchenState,
          vendorId,
        },
      });

      if (openingTime && closingTime) {
        await tx.vendor.update({
          where: {
            id: vendorId,
          },
          data: {
            openingTime: new Date(openingTime),
            closingTime: new Date(closingTime),
          },
        });
      }

      if (is247) {
        await tx.vendor.update({
          where: {
            id: vendorId,
          },
          data: {
            is247,
          },
        });
      }
    });

    return responsePlate({
      res,
      message: "Vendor details updated, successfully",
      status: 201,
    });
  } catch (e) {
    console.log("error in createFoodVendorService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
