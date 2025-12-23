import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { createClosedDaySchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createClosedDaysService = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = createClosedDaySchema.safeParse({
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

    const { vendorId, closedDays } = data;

    await prisma.closedDays.createMany({
      data: closedDays.map((dt) => {
        return {
          day: dt,
          vendorId: vendorId,
        };
      }),
    });

    return responsePlate({
      res,
      message: "Availability added successfully",
      status: 201,
    });
  } catch (e) {
    console.log("error in createClosedDaysService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
