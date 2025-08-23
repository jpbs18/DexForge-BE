import { Request, Response } from "express";
import NewsService from "./service";

export class NewsController {
  static async getPokemonNews(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);
    const result = await NewsService.fetchPokemonNews(page, pageSize);

    res.json({
      page,
      pageSize,
      totalResults: result.totalResults,
      articles: result.articles,
    });
  }
}
