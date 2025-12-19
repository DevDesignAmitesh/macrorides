import { Router } from "express";
import { meService } from "../services/account/me";
import { commonMiddleware } from "../middleware/common";

export const accountRouter: Router = Router();

accountRouter.get("/me", commonMiddleware, meService);
