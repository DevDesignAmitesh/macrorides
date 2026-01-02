import { Router } from "express";
import { meService } from "../services/account/me";
import { commonMiddleware } from "../middleware/common";
import { bankDetailsService } from "../services/account/bank-details";

export const accountRouter: Router = Router();

accountRouter.get("/me", commonMiddleware, meService);
accountRouter.post("/bank-details", commonMiddleware, bankDetailsService);
