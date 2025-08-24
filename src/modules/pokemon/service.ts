import { ApiError } from "../../middlewares/errorHandler";
import { pokemonBasicInfo, pokemonDetailsTable } from "./entities";

export default class PokemonService {
  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await pokemonBasicInfo.countDocuments();
    const totalPages = Math.ceil(total / limit);

    if (page <= 0 || page > totalPages) {
      throw new ApiError(
        `Invalid page number. Must be between 1 and ${totalPages}`,
        400
      );
    }

    const data = await pokemonBasicInfo.find().skip(skip).limit(limit);
    return { page, limit, total, totalPages, data };
  }

  static async getById(id: number) {
    const pokemon = await pokemonDetailsTable.findOne({ id });

    if (!pokemon) {
      throw new ApiError("Pokémon not found", 404);
    }

    return pokemon;
  }
}
