import { Router } from "express";
import { meService } from "../services/account/me";

export const accountRouter: Router = Router();

accountRouter.get("/me", meService)