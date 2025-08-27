import PokemonService from "../../../modules/pokemon/service";
import {
  pokemonBasicInfo,
  pokemonDetailsTable,
} from "../../../modules/pokemon/entities";
import { ApiError } from "../../../middlewares/errorHandler";

jest.mock("../../../modules/pokemon/entities", () => ({
  pokemonBasicInfo: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
  pokemonDetailsTable: {
    findOne: jest.fn(),
  },
}));

describe("PokemonService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should throw error if requested page > totalPages", async () => {
      (pokemonBasicInfo.countDocuments as jest.Mock).mockResolvedValue(10);

      (pokemonBasicInfo.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      await expect(PokemonService.getAll(6, 2)).rejects.toThrow(ApiError);
    });

    it("should return paginated results", async () => {
      (pokemonBasicInfo.countDocuments as jest.Mock).mockResolvedValue(20);
      (pokemonBasicInfo.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ id: 1, name: "Bulbasaur" }]),
      });

      const result = await PokemonService.getAll(1, 10);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(20);
      expect(result.totalPages).toBe(2);
      expect(result.data).toEqual([{ id: 1, name: "Bulbasaur" }]);

      expect(pokemonBasicInfo.countDocuments).toHaveBeenCalled();
      expect(pokemonBasicInfo.find).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should throw error if pokemon not found", async () => {
      (pokemonDetailsTable.findOne as jest.Mock).mockResolvedValue(null);

      await expect(PokemonService.getById(9999)).rejects.toThrow(ApiError);
    });

    it("should return pokemon details if found", async () => {
      const fakePokemon = { id: 1, name: "Bulbasaur" };
      (pokemonDetailsTable.findOne as jest.Mock).mockResolvedValue(fakePokemon);

      const result = await PokemonService.getById(1);

      expect(result).toEqual(fakePokemon);
      expect(pokemonDetailsTable.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
