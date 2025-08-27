import { Request, Response } from "express";
import { NewsController } from "../../../modules/news/controller";
import NewsService from "../../../modules/news/service";
import { ApiError } from "../../../middlewares/errorHandler";

jest.mock("../../../modules/news/service");

describe("NewsController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe("getPokemonNews", () => {
    it("should throw error for invalid page", async () => {
      req.query = { page: "0", pageSize: "10" };

      await expect(
        NewsController.getPokemonNews(req as Request, res as Response)
      ).rejects.toThrow(ApiError);
    });

    it("should throw error for invalid pageSize", async () => {
      req.query = { page: "1", pageSize: "30" };

      await expect(
        NewsController.getPokemonNews(req as Request, res as Response)
      ).rejects.toThrow(ApiError);
    });

    it("should return news data with valid params", async () => {
      req.query = { page: "1", pageSize: "10" };

      (NewsService.fetchPokemonNews as jest.Mock).mockResolvedValue({
        totalResults: 100,
        articles: [{ title: "PokeNews", url: "https://poke.news" }],
      });

      await NewsController.getPokemonNews(req as Request, res as Response);

      expect(NewsService.fetchPokemonNews).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        totalResults: 100,
        articles: [{ title: "PokeNews", url: "https://poke.news" }],
      });
    });
  });
});
