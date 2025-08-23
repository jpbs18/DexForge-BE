import { Request, Response } from "express";
import PokemonService from "./service";

export class PokemonController {
  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const result = await PokemonService.getAll(page, limit);

    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const pokemon = await PokemonService.getById(id);
   
    res.json(pokemon);
  }
}
