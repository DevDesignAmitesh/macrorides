import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { vehicleBasicInfoSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const vehicleBasicInfoService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { success, data, error } = vehicleBasicInfoSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

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
        status: 400,
      });
    }

    if (!account.driver) {
      return responsePlate({
        res,
        message: "Only for drivers",
        status: 403,
      });
    }

    const {
      isElectric,
      rcNumber,
      color,
      ownershipStatus,
      range,
      registrationNumber,
      type,
      identificationNumber,
    } = data;

    await prisma.driverVehicleDetails.create({
      data: {
        driverId: account.driver.id,
        isElectric,
        rcNumber,
        color,
        ownershipStatus,
        range,
        registrationNumber,
        type,
        identificationNumber,
      },
    });

    return responsePlate({
      res,
      message: "Vehicle details created",
      status: 201,
    });
  } catch (e) {
    console.log("error in vehicleBasicInfoService ", e);
    return responsePlate({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
};
