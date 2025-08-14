import { Router, Request, Response } from "express";
import Pokemon from "../models/Pokemon";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const skip = (page - 1) * limit;

    const pokemons = await Pokemon.find({})
      .skip(skip)
      .limit(limit)
      .select("id name types sprites.other.official-artwork.front_default");

    const total = await Pokemon.countDocuments();
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
      data
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const pokemonId = parseInt(req.params.id, 10);
    
    if (isNaN(pokemonId)) {
      res.status(400);
      throw new Error("Invalid Pokémon ID");
    }

    const pokemon = await Pokemon.findOne({ id: pokemonId });

    if (!pokemon) {
      res.status(404);
      throw new Error("Pokémon not found");
    }

    res.json(pokemon);
  })
);

export default router;
