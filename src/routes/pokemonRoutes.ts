import { Router, Request, Response } from "express";
import Pokemon from "../models/Pokemon";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const skip = (page - 1) * limit;

    const pokemons = await Pokemon.find({})
      .skip(skip)
      .limit(limit)
      .select("id name types sprites.other.official-artwork.front_default");

    const total = await Pokemon.countDocuments();
    const data = pokemons.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map(t => t.type.name),
      front_default: pokemon.sprites.other["official-artwork"].front_default,
    }));

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (error) {
    console.error("Error fetching paginated Pokémon:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const pokemonId = parseInt(req.params.id, 10);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ message: "Invalid Pokémon ID" });
    }

    const pokemon = await Pokemon.findOne({ id: pokemonId })
      .select("id name types sprites.other.official-artwork.front_default");

    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon not found" });
    }

    const result = {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map(t => t.type.name),
      front_default: pokemon.sprites.other["official-artwork"].front_default
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
