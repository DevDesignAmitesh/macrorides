import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { deleteClosedDaySchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const deleteClosedDayService = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = deleteClosedDaySchema.safeParse({
      closingDayId: req.params.id,
      vendorId: req.params.vendorId,
    });

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { closingDayId, vendorId } = data;

    const closedDay = await prisma.closedDays.findFirst({
      where: {
        id: closingDayId,
        vendorId: vendorId,
      },
    });

    if (!closedDay) {
      return responsePlate({
        res,
        message: "day not found",
        status: 404,
      });
    }

    await prisma.closedDays
      .delete({
        where: {
          id: closingDayId,
          vendorId: vendorId,
        },
      })
      .then(() => {
        return responsePlate({
          res,
          message: "day deleted successfully",
          status: 200,
        });
      })
      .catch((er) => {
        console.log(
          "error while deleting closed days in deleteClosedDayService ",
          er
        );

        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
      });
  } catch (e) {
    console.log("error in deleteClosedDayService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
