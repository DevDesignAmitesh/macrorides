import { Request, Response } from "express";
import { responsePlate } from "../../utils";
import { bankDetailsSchema, zodErrorMessage } from "@repo/types/types";
import { prisma } from "@repo/db/db";

export const bankDetailsService = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { success, data, error } = bankDetailsSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { accountHolderName, accountNumber, bankName, ifscCode } = data;

    await prisma.bankDetails.create({
      data: {
        accountId: userId,
        accountHolderName,
        accountNumber,
        bankName,
        ifscCode,
      },
    });

    return responsePlate({
      res,
      message: "Bank details added successfully",
      status: 201,
    });
  } catch (e) {
    console.log("error in bankDetailsService ", e);
    return responsePlate({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
};
