import { Request, Response } from "express";
import { responsePlate, uploadToImageKit } from "../../utils";
import { prisma } from "@repo/db/db";

export const vehicleDocumentationService = async (
  req: Request,
  res: Response
) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return responsePlate({
        res,
        message: "Invalid params provided",
        status: 411,
      });
    }

    let insurance: string = "";
    let rc: string = "";
    let image: string = "";

    if (req.files && "insurance" in req.files) {
      await Promise.all(
        (req.files as any).insurance.map(
          async (file: Express.Multer.File) =>
            (insurance = (await uploadToImageKit(file, "insurance")) as string)
        )
      );
    }

    if (req.files && "rc" in req.files) {
      await Promise.all(
        (req.files as any).rc.map(
          async (file: Express.Multer.File) =>
            (rc = (await uploadToImageKit(file, "rc")) as string)
        )
      );
    }

    if (req.files && "image" in req.files) {
      await Promise.all(
        (req.files as any).image.map(
          async (file: Express.Multer.File) =>
            (image = (await uploadToImageKit(file, "image")) as string)
        )
      );
    }

    await prisma.driverVehicleDetails.update({
      where: {
        id: documentId,
      },
      data: {
        rc,
        insurance,
        image,
      },
    });

    return responsePlate({
      res,
      message: "Vehicle detais updated",
      status: 201,
    });
  } catch (e) {
    console.log("error in vehicleDocumentationService ", e);
    return responsePlate({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
};
