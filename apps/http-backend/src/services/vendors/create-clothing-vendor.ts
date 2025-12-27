import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import {
  clothVendorCreateOrUpdateSchema,
  zodErrorMessage,
} from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createClothingVendorService = async (
  req: Request,
  res: Response
) => {
  try {
    const { success, error, data } = clothVendorCreateOrUpdateSchema.safeParse({
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

    const { operationalState, returnPolicy, vendorId } = data;

    await prisma.clothVendor
      .upsert({
        where: {
          vendorId,
        },
        create: {
          operationalState,
          returnPolicy,
          vendorId,
        },
        update: {
          operationalState,
          returnPolicy,
          vendorId,
        },
      })
      .then((data) => {
        return responsePlate({
          res,
          message: "cloth vendor created",
          status: 201,
          data: {
            vendorId: data.id,
          },
        });
      })
      .catch((err) => {
        console.log(
          "error while creating cloth vendor in createFoodVendorService ",
          err
        );
        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
      });
  } catch (e) {
    console.log("error in createClothingVendorService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
