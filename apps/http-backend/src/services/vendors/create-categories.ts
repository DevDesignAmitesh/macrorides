import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { createCategoriesSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createCategoriesService = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = createCategoriesSchema.safeParse({
      ...req.body,
    });

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { vendorId, name } = data;

    await prisma.categories
      .createMany({
        data: name.map((nm) => {
          return {
            vendorId: vendorId,
            name: nm,
          };
        }),
      })
      .then(() => {
        return responsePlate({
          res,
          message: "categroies created successfully",
          status: 201,
        });
      })
      .catch((err) => {
        console.log(
          "error while creating categories in createCategoriesService ",
          err
        );
        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
      });
  } catch (e) {
    console.log("error in createCategoriesService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
