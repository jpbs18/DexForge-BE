import { Router, Request, Response } from "express";
import { pokemonTable, pokemonDetailsTable } from "../models/Pokemon";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middlewares/errorHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const skip = (page - 1) * limit;

    const pokemons = await pokemonTable
      .find({})
      .skip(skip)
      .limit(limit)
      .select("id name types sprites.other.official-artwork.front_default");

    const total = await pokemonTable.countDocuments();
    const data = pokemons.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      front_default: pokemon.sprites.other["official-artwork"].front_default,
    }));

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const pokemonId = parseInt(req.params.id, 10);

    if (isNaN(pokemonId)) {
      throw new ApiError("Invalid Pokémon ID", 400);
    }

    const pokemonDetails = await pokemonDetailsTable.findOne({ id: pokemonId });
    const pokemon = await pokemonTable
      .findOne({ id: pokemonId })
      .select(
        "id abilities name types sprites.other.official-artwork.front_default stats height weight"
      );

    if (!pokemon || !pokemonDetails) {
      throw new ApiError("Pokémon not found", 404);
    }

    const data = {
      id: pokemon.id,
      abilities: pokemon.abilities.map((a) => a.ability.name),
      name: pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      front_default: pokemon.sprites.other["official-artwork"].front_default,
      height: pokemon.height,
      weight: pokemon.weight,
      stats: pokemon.stats,
      evolutions: pokemonDetails.evolutions,
      weaknesses: pokemonDetails.weaknesses,
      genders: pokemonDetails.genders,
      category: pokemonDetails.category,
    };

    res.json(data);
  })
);

export default router;
