import { config } from "../../config/configuration";
import { ApiError } from "../../middlewares/errorHandler";
import { Article, ArticleDTO } from "./types";

export default class NewsService {
  static async fetchPokemonNews(
    page: number,
    pageSize: number
  ): Promise<{ totalResults: number; articles: ArticleDTO[] }> {
    if (page < 1) {
      throw new ApiError("Page must be a positive integer", 400);
    }

    if (pageSize < 1 || pageSize > 20) {
      throw new ApiError("Page size must be between 1 and 20", 400);
    }

    const response = await fetch(
      `${config.newsApiUrl}/everything?qInTitle=pokemon&language=en&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${config.newsApiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const data = await response.json();
    const seen = new Set<string>();

    const articles: ArticleDTO[] = (
      await Promise.all(
        data.articles.map(async (article: Article) => {
          if (!article.urlToImage) return null;

          try {
            const headResponse = await fetch(article.urlToImage, {
              method: "HEAD",
            });
            if (!headResponse.ok) return null;

            if (seen.has(article.title)) return null;
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
      )
    ).filter((a): a is ArticleDTO => a !== null);

    return { totalResults: data.totalResults, articles };
  }
}
