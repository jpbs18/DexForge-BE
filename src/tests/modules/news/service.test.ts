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

  it("should return filtered articles", async () => {
    const apiResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        totalResults: 2,
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
        ],
      }),
    };

    const headResponse = { ok: true };

    (fetch as jest.Mock)
      .mockResolvedValueOnce(apiResponse)
      .mockResolvedValueOnce(headResponse);

    const result = await NewsService.fetchPokemonNews(1, 10);

    expect(result.totalResults).toBe(2);
    expect(result.articles.length).toBe(1);
    expect(result.articles[0].title).toBe("A");
  });
});
