import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import {
  getVendorSchema,
  VendorResponse,
  zodErrorMessage,
} from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const getVendorService = async (req: Request, res: Response) => {
  try {
    const { data, error, success } = getVendorSchema.safeParse({
      vendorId: req.params.vendorId,
    });

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { vendorId } = data;

    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
      },
      include: {
        foodVendor: true,
        clothVendor: true,
        closedDays: true,
        owner: true,
        location: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!vendor) {
      return responsePlate({
        res,
        message: "vendor not found with the given id",
        status: 404,
      });
    }

    const dataToSend: VendorResponse = {
      aadhaarNumber: vendor.aadhaarNumber,
      closedDays: vendor.closedDays,
      contactNumber: vendor.contactNumber,
      createdAt: vendor.createdAt.toISOString(),
      id: vendor.id,
      isVerified: vendor.isVerified,
      locations: vendor.location.map((lc) => {
        return {
          id: lc.location.id,
          address: lc.location.address,
          contactPhone: lc.contactPhone,
          label: lc.location.label,
          latitude: lc.location.latitude,
          longitude: lc.location.longitude,
        };
      }),
      outletName: vendor.outletName,
      owner: {
        accountId: vendor.owner.accountId,
        id: vendor.ownerId,
      },
      panNumber: vendor.panNumber,
      type: vendor.type,
      gstNumber: vendor.gstNumber,
      updatedAt: vendor.updatedAt.toISOString(),
      clothVendor: vendor.clothVendor,
      foodVendor: vendor.foodVendor && {
        closingTime: vendor.foodVendor?.closingTime.toISOString(),
        fssaiNumber: vendor.foodVendor.fssaiNumber,
        is247: vendor.foodVendor.is247,
        kitchenState: vendor.foodVendor.kitchenState,
        openingTime: vendor.foodVendor.openingTime.toISOString(),
      },
    };

    return responsePlate({
      res,
      message: "vendor details found",
      status: 200,
      data: {
        vendor: dataToSend,
      },
    });
  } catch (e) {
    console.log("error in getVendorService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
