import { config } from "../../config/configuration";


describe("AppConfig", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("throws error if MONGO_URI is missing", () => {
    delete process.env.MONGO_URI;
    expect(() => config.mongoUri).toThrow("MONGO_URI is not defined");
  });

  it("returns mongoUri when defined", () => {
    process.env.MONGO_URI = "mongodb://localhost:27017/testdb";
    expect(config.mongoUri).toBe("mongodb://localhost:27017/testdb");
  });

  it("returns default port if PORT is not set", () => {
    delete process.env.PORT;
    expect(config.port).toBe(5000);
  });

  it("returns custom port if PORT is set", () => {
    process.env.PORT = "8080";
    expect(config.port).toBe(8080);
  });

  it("throws error if NEWS_API_KEY is missing", () => {
    delete process.env.NEWS_API_KEY;
    expect(() => config.newsApiKey).toThrow("NEWS_API_KEY is not defined");
  });

  it("returns NEWS_API_KEY when defined", () => {
    process.env.NEWS_API_KEY = "test-api-key";
    expect(config.newsApiKey).toBe("test-api-key");
  });

  it("throws error if NEWS_API_URL is missing", () => {
    delete process.env.NEWS_API_URL;
    expect(() => config.newsApiUrl).toThrow("NEWS_API_URL is not defined");
  });

  it("returns NEWS_API_URL when defined", () => {
    process.env.NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
    expect(config.newsApiUrl).toBe("https://newsapi.org/v2/top-headlines");
  });
});
