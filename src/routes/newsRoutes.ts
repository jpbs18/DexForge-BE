import { Router, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middlewares/errorHandler";
import dotenv from "dotenv";
import { Article } from "../models/Article";

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

    console.log(pageSize)
    const response = await fetch(
      `https://newsapi.org/v2/everything?qInTitle=pokemon&language=en&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new ApiError("Failed to fetch news from NewsAPI", response.status);
    }

    const data = await response.json();

    const articles = data.articles
      .filter((article: Article) => article.urlToImage)
      .map((article: Article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source,
      }));

    res.json({
      page,
      pageSize,
      totalResults: data.totalResults,
      articles,
    });
  })
);

export default router;
