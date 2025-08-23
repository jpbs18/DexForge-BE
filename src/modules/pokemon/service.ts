import { ApiError } from "../../middlewares/errorHandler";
import { pokemonBasicInfo, pokemonDetailsTable } from "./entity";

export default class PokemonService {
  static async getAll(page: number, limit: number) {
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

    const data = await pokemonBasicInfo.find().skip(skip).limit(limit);
    return { page, limit, total, totalPages, data };
  }

  static async getById(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new ApiError("Invalid Pokémon ID", 400);
    }

    const pokemon = pokemonDetailsTable.findOne({ id });

    if (!pokemon) {
      throw new ApiError("Pokémon not found", 404);
    }

    return pokemon;
  }
}
