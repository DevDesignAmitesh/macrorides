import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { createCategoriesSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createCategoriesService = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { success, error, data } = createCategoriesSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { vendorId, name } = data;

    for (const categoryName of name) {
      await prisma.categories.create({
        data: {
          name: categoryName,
          vendorId,
        },
      });
    }

    return responsePlate({
      res,
      message: "categories created successfully",
      status: 201,
    });
  } catch (err) {
    console.log(
      "error while creating categories in createCategoriesService",
      err
    );

    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
