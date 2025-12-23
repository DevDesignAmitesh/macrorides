import { Router } from "express";
import { suggestionsService } from "../services/map/get-suggestions";

export const mapRouter: Router = Router();

mapRouter.get("/suggestions/:input", suggestionsService);
