import NewsService from "../../../modules/news/service";
import { ApiError } from "../../../middlewares/errorHandler";

beforeAll(() => {
  process.env.NEWS_API_URL = "https://fake-news-api.com";
  process.env.NEWS_API_KEY = "fake-api-key";
});
afterAll(() => {
  delete process.env.NEWS_API_URL;
  delete process.env.NEWS_API_KEY;
});

global.fetch = jest.fn();

describe("NewsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if API response not ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    await expect(NewsService.fetchPokemonNews(1, 10)).rejects.toThrow(ApiError);
  });

  it("returns only valid articles with images and unique titles", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "HEAD") {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalResults: 3,
            articles: [
              {
                title: "A",
                urlToImage: "img1",
                description: "",
                url: "",
                publishedAt: "",
                source: { id: "1", name: "News1" },
              },
              {
                title: "B",
                urlToImage: null,
                description: "",
                url: "",
                publishedAt: "",
                source: { id: "2", name: "News2" },
              },
              {
                title: "A",
                urlToImage: "img2",
                description: "",
                url: "",
                publishedAt: "",
                source: { id: "3", name: "News3" },
              },
            ],
          }),
      });
    });

    const result = await NewsService.fetchPokemonNews(1, 10);
    expect(result.totalResults).toBe(3);
    expect(result.articles.length).toBe(1);
    expect(result.articles[0].title).toBe("A");
  });

  it("skips article if image HEAD request fails", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "HEAD") {
        return Promise.resolve({ ok: false });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalResults: 1,
            articles: [
              {
                title: "Broken",
                urlToImage: "img",
                description: "",
                url: "",
                publishedAt: "",
                source: { id: "1", name: "News1" },
              },
            ],
          }),
      });
    });

    const result = await NewsService.fetchPokemonNews(1, 10);
    expect(result.articles.length).toBe(0);
  });

  it("skips article if image HEAD request throws error", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "HEAD") return Promise.reject(new Error("fail"));

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalResults: 1,
            articles: [
              {
                title: "Throw",
                urlToImage: "img",
                description: "",
                url: "",
                publishedAt: "",
                source: { id: "1", name: "News1" },
              },
            ],
          }),
      });
    });

    const result = await NewsService.fetchPokemonNews(1, 10);
    expect(result.articles.length).toBe(0);
  });

  it("handles empty articles array", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "HEAD") return Promise.resolve({ ok: true });

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ totalResults: 0, articles: [] }),
      });
    });

    const result = await NewsService.fetchPokemonNews(1, 10);
    expect(result.totalResults).toBe(0);
    expect(result.articles).toEqual([]);
  });
});
