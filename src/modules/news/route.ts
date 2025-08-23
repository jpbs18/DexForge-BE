import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { NewsController } from "./controller";

const router = Router();

router.get("/", asyncHandler(NewsController.getPokemonNews));

export default router;
