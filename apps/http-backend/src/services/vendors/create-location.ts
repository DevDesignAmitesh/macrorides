import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { createLocationSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createLocationService = async (req: Request, res: Response) => {
  try {
    const finalData = req.body.map((item: any) => ({
      ...item,
      vendorId: req.params.vendorId,
    }));

    const { data, success, error } = createLocationSchema.safeParse(finalData);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const existingVendor = await prisma.vendor.findFirst({
      where: {
        id: data[0]?.vendorId,
      },
    });

    if (!existingVendor) {
      return responsePlate({
        res,
        message: "vendor not found with the provided id",
        status: 404,
      });
    }

    await prisma.$transaction(async (tx) => {
      for (const dt of data) {
        const location = await tx.location.create({
          data: {
            latitude: dt.latitude,
            longitude: dt.longitude,
            address: dt.address,
            label: dt.label,
          },
        });

        await tx.vendorSavedLocation.create({
          data: {
            vendorId: existingVendor.id,
            locationId: location.id,
            contactPhone: existingVendor.contactNumber,
          },
        });
      }
    });

    return responsePlate({
      res,
      message: "Location(s) created successfully",
      status: 201,
    });
  } catch (e) {
    console.log("error in createLocationService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
