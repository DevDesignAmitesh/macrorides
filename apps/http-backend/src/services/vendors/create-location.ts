import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { createLocationSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createLocationService = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = createLocationSchema.safeParse({
      ...req.body,
      vendorId: req.params.vendorId,
    });

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    await prisma.location.createMany({
      data: data.map((dt) => {
        return {
          latitude: dt.latitude,
          longitude: dt.longitude,
          address: dt.address,
          label: dt.label,
          vendorId: dt.vendorId,
        };
      }),
    }).then(() => {
      return responsePlate({
        res,
        message: "location created successfully",
        status: 201
      })
    }).catch((er) => {
      console.log("error while creating location in createLocationService ", er);

      return responsePlate({
        res,
        message: "internal server error",
        status: 503
      })
    })
  } catch (e) {
    console.log("error in createLocationService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
