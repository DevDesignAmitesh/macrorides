import { NextFunction, Request, Response } from "express";
import { responsePlate, verifyToken } from "../utils";

export const commonMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return responsePlate({
        res,
        message: "un-authorized",
        status: 401,
      });
    }

    const bearerToken = token.split("Bearer ")[1];

    if (!bearerToken) {
      return responsePlate({
        res,
        message: "un-authorized",
        status: 401,
      });
    }

    const decoded = verifyToken({ token: bearerToken });

    if (!decoded.userId) {
      return responsePlate({
        res,
        message: "un-authorized",
        status: 401,
      });
    }

    req.user = decoded;
    next();
  } catch (e) {
    console.log("error in commonMiddleware ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
    });
  }
};
