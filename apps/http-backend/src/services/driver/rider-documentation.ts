import { Request, Response } from "express";
import { responsePlate, uploadToImageKit } from "../../utils";
import { prisma } from "@repo/db/db";

export const riderDocumentationService = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { documentId } = req.params;

    if (!documentId) {
      return responsePlate({
        res,
        message: "Invalid params provided",
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
        status: 404,
      });
    }

    if (!account.driver) {
      return responsePlate({
        res,
        message: "Only for drivers",
        status: 403,
      });
    }

    let license: string = "";
    let aadhaarCard: string = "";
    let vehicleOwnerShipProof: string = "";

    if (req.files && "license" in req.files) {
      await Promise.all(
        (req.files as any).license.map(
          async (file: Express.Multer.File) =>
            (license = (await uploadToImageKit(file, "license")) as string)
        )
      );
    }

    if (req.files && "aadhaarCard" in req.files) {
      await Promise.all(
        (req.files as any).aadhaarCard.map(
          async (file: Express.Multer.File) =>
            (aadhaarCard = (await uploadToImageKit(
              file,
              "aadhaarCard"
            )) as string)
        )
      );
    }

    if (req.files && "vehicleOwnerShipProof" in req.files) {
      await Promise.all(
        (req.files as any).vehicleOwnerShipProof.map(
          async (file: Express.Multer.File) =>
            (vehicleOwnerShipProof = (await uploadToImageKit(
              file,
              "vehicleOwnerShipProof"
            )) as string)
        )
      );
    }

    await prisma.driverPersonalDetails.update({
      where: {
        driverId: account.driver.id,
      },
      data: {
        vehicleOwnerShipProof,
        license,
        aadhaarCard,
      },
    });

    return responsePlate({
      res,
      message: "Driver detais updated",
      status: 201,
    });
  } catch (e) {
    console.log("error in riderDocumentationService ", e);
    return responsePlate({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
};
