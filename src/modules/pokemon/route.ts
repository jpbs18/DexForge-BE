import { Router } from "express";
import { PokemonController } from "./controller";
import { asyncHandler } from "../../middlewares/asyncHandler";

const router = Router();

router.get("/", asyncHandler(PokemonController.getAll));
router.get("/:id", asyncHandler(PokemonController.getById));

export default router;
