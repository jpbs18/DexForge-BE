import { Router, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middlewares/errorHandler";
import dotenv from "dotenv";
import { Article } from "../models/Article";
import { ArticleDTO } from "../dto/AritcleDTO";

dotenv.config();
const NEWS_API_KEY = process.env.NEWS_API_KEY as string;

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const pageSize = parseInt(req.query.pageSize as string);
    const page = parseInt(req.query.page as string);

    if (isNaN(page) || page < 1) {
      throw new ApiError("Page must be a positive integer", 400);
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 20) {
      throw new ApiError(
        "Page size must be a positive integer between 1 and 20",
        400
      );
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?qInTitle=pokemon&language=en&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new ApiError("Failed to fetch news from NewsAPI", response.status);
    }

    const data = await response.json();
    const seen = new Set<string>();

    const articles: ArticleDTO[] = await Promise.all(
      data.articles.map(async (article: Article) => {
        if (!article.urlToImage) return null;

        try {
          const headResponse = await fetch(article.urlToImage, {
            method: "HEAD",
          });
          if (!headResponse.ok) return null;

          seen.add(article.title);
          return {
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source,
          } as ArticleDTO;
        } catch {
          return null;
        }
      })
    );

    const filteredArticles = articles.filter(
      (dto): dto is ArticleDTO => dto !== null
    );

    res.json({
      page,
      pageSize,
      totalResults: data.totalResults,
      articles: filteredArticles,
    });
  })
);

export default router;
