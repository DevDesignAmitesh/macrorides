import { Request, Response } from "express";
import { responsePlate, uploadToImageKit } from "../../utils";
import { createFoodItemSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const createFoodItemService = async (req: Request, res: Response) => {
  try {
    if (!req?.file) {
      return responsePlate({
        res,
        message: "image is required",
        status: 411,
      });
    }

    const { success, data, error } = createFoodItemSchema.safeParse({
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

    const { description, isAvailable, name, price, vendorId } = data;

    let imageUrl = await uploadToImageKit(req?.file, "food-images-" + vendorId);

    await prisma.foodItem
      .create({
        data: {
          description,
          isAvailable,
          foodVendorId: vendorId,
          name,
          price,
          imageUrl:
            typeof imageUrl === "string" ? imageUrl : (imageUrl[0] as string),
        },
      })
      .then(() => {
        return responsePlate({
          res,
          message: "food item created successfully",
          status: 201,
        });
      })
      .catch((err) => {
        console.log(
          "error while creating food item in createFoodItemService ",
          err
        );
        return responsePlate({
          res,
          message: "internal server error",
          status: 503,
        });
      });
  } catch (e) {
    console.log("error in createFoodItemService ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
