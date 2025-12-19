import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import {
  createClothingProductSchema,
  zodErrorMessage,
} from "@repo/types/types";

export const createClothItemService = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = createClothingProductSchema.safeParse({
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

    const { brand, description, name, vendorId } = data;
  } catch (e) {
    console.log("error in createClothItemService ", e);

    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
