import { accountSignupSchema, zodErrorMessage } from "@repo/types/types";
import { responsePlate } from "../../utils";
import { Request, Response } from "express";
import { prisma } from "@repo/db/db";

export const registerService = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = accountSignupSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { name, phone, role } = data;

    if (role === "CUSTOMER") {
      await prisma.$transaction(async (tx) => {
        await tx.account
          .create({
            data: {
              name,
              phone,
            },
          })
          .then(async (data) => {
            await tx.customer
              .create({
                data: {
                  accountId: data.id,
                },
              })
              .then(async (data) => {
                // here we should sent OTP

                return responsePlate({
                  res,
                  message:
                    "OTP has been successfully sent to your phone number " +
                    phone,
                  status: 201,
                });
              })
              .catch((err) => {
                console.log("error while creating customer ", err);
                return responsePlate({
                  res,
                  message: "something went wrong",
                  status: 503,
                });
              });
          })
          .catch((err) => {
            console.log("error while creating account ", err);
            return responsePlate({
              res,
              message: "something went wrong",
              status: 503,
            });
          });
      });
    } else if (role === "VENDOR_OWNER") {
    }

    return responsePlate({
      res,
      message: "invalid role provided",
      status: 400,
    });
  } catch (e) {
    console.log("error in registerService ", e);
    return responsePlate({
      res,
      status: 500,
      message: "internal server error",
    });
  }
};
