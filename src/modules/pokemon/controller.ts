import { Request, Response } from "express";
import PokemonService from "./service";
import { ApiError } from "../../middlewares/errorHandler";

export class PokemonController {
  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    if (isNaN(page) || page < 1) {
      throw new ApiError("`page` must be a positive integer", 400);
    }

    if (isNaN(limit) || limit < 1) {
      throw new ApiError("`limit` must be a positive integer", 400);
    }

    const result = await PokemonService.getAll(page, limit);
    res.status(200).json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0 || id > 1025) {
      throw new ApiError("Invalid Pokémon ID", 400);
    }

    const pokemon = await PokemonService.getById(id);
    res.status(200).json(pokemon);
  }
}
