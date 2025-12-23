import { maps } from "@repo/maps/maps";
import { suggestionSchema, zodErrorMessage } from "@repo/types/types";
import { Request, Response } from "express";
import { responsePlate } from "../../utils";

export const suggestionsService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { data, success, error } = suggestionSchema.safeParse(req.params);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
      });
    }

    const { input } = data;

    const suggestions = await maps.getAutoCompletion(input);

    return res.status(200).json({ message: "suggestions found", suggestions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
