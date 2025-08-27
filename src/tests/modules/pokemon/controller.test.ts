import { Request, Response } from "express";
import { PokemonController } from "../../../modules/pokemon/controller";
import PokemonService from "../../../modules/pokemon/service";
import { ApiError } from "../../../middlewares/errorHandler";

jest.mock("../../../modules/pokemon/service");

describe("PokemonController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should throw error if page is invalid", async () => {
      req.query = { page: "0", limit: "10" };

      await expect(
        PokemonController.getAll(req as Request, res as Response)
      ).rejects.toThrow(ApiError);
    });

    it("should return paginated data", async () => {
      req.query = { page: "1", limit: "10" };

      (PokemonService.getAll as jest.Mock).mockResolvedValue({
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        data: [{ id: 1, name: "Bulbasaur" }],
      });

      await PokemonController.getAll(req as Request, res as Response);

      expect(PokemonService.getAll).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: [{ id: 1, name: "Bulbasaur" }] })
      );
    });
  });

  describe("getById", () => {
    it("should throw error if id is invalid", async () => {
      req.params = { id: "0" };

      await expect(
        PokemonController.getById(req as Request, res as Response)
      ).rejects.toThrow(ApiError);
    });

    it("should return pokemon details", async () => {
      req.params = { id: "1" };
      (PokemonService.getById as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Bulbasaur",
      });

      await PokemonController.getById(req as Request, res as Response);

      expect(PokemonService.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: "Bulbasaur" })
      );
    });
  });
});
