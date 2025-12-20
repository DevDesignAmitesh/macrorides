import {
  createClothingVariantsSchema,
  zodErrorMessage,
} from "@repo/types/types";
import { Request, Response } from "express";
import { generateSKU, responsePlate } from "../../utils";
import { prisma } from "@repo/db/db";

export const createClothVariantSchema = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = createClothingVariantsSchema.safeParse({
      ...req.body,
      ...req.params,
    });

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    await prisma.clothingVariant
      .createMany({
        data: data.map((dt) => {
          const sku = generateSKU(dt);
          const size = dt.size.trim().toUpperCase();
          const color = dt.color.trim().toUpperCase();
          return {
            clothingVendorID: dt.vendorId,
            productId: dt.productId,
            size,
            color,
            price: dt.price,
            stockQty: dt.stockQty,
            sku,
          };
        }),
      })
      .then(() => {
        return responsePlate({
          res,
          message: "clothing variant created successfully",
          status: 201,
        });
      })
      .catch((err) => {
        console.log(
          "error while creating clothing variant in createClothVariantSchema ",
          err
        );
        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
      });
  } catch (e) {
    console.log("error in createClothVariantSchema ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
