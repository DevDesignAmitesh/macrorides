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
      fssaiNumber,
      is247,
      kitchenState,
      openingTime,
      vendorId,
    } = data;

    await prisma.foodVendor
      .create({
        data: {
          closingTime,
          fssaiNumber,
          is247,
          kitchenState,
          openingTime,
          vendorId,
        },
      })
      .then(() => {
        return responsePlate({
          res,
          message: "food vendor created",
          status: 201,
        });
      })
      .catch((err) => {
        console.log(
          "error while creating food vendor in createFoodVendorService ",
          err
        );
        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
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
