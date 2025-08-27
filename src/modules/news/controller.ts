import { Request, Response } from "express";
import NewsService from "./service";
import { ApiError } from "../../middlewares/errorHandler";

export class NewsController {
  static async getPokemonNews(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);
    const result = await NewsService.fetchPokemonNews(page, pageSize);

    if (page < 1) {
      throw new ApiError("Page must be a positive integer", 400);
    }

    if (pageSize < 1 || pageSize > 20) {
      throw new ApiError("Page size must be between 1 and 20", 400);
    }

    res.status(200).json({
      page,
      pageSize,
      totalResults: result.totalResults,
      articles: result.articles,
    });
  }
}
