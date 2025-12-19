import { Response } from "express";

export const responsePlate = ({
  res,
  message,
  status,
  data,
}: {
  res: Response;
  message: string;
  status: number;
  data?: any;
}) => {
  return res.status(status).json({
    message,
    data,
  });
};
