import { Router, Request, Response } from "express";
import { pokemonBasicInfo, pokemonDetailsTable } from "../models/Pokemon";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middlewares/errorHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    if (isNaN(page) || page < 1) {
      throw new ApiError("`page` must be a positive integer", 400);
    }

    if (isNaN(limit) || limit < 1) {
      throw new ApiError("`limit` must be a positive integer", 400);
    }

    const skip = (page - 1) * limit;
    const total = await pokemonBasicInfo.countDocuments();
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages) {
      throw new ApiError(
        "Invalid page number for the amount of total pages",
        400
      );
    }

    const pokemons = await pokemonBasicInfo.find({}).skip(skip).limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      data: pokemons,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const pokemonId = parseInt(req.params.id);

    if (isNaN(pokemonId) || pokemonId <= 0) {
      throw new ApiError("Invalid Pokémon ID", 400);
    }

    const pokemonDetails = await pokemonDetailsTable.findOne({ id: pokemonId });

    if (!pokemonDetails) {
      throw new ApiError("Pokémon not found", 404);
    }

    res.json(pokemonDetails);
  })
);

export default router;
