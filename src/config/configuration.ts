import dotenv from "dotenv";

dotenv.config();

class AppConfig {
  get mongoUri(): string {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    return process.env.MONGO_URI;
  }

  get port(): number {
    return parseInt(process.env.PORT || "5000", 10);
  }

  get newsApiKey(): string {
    if (!process.env.NEWS_API_KEY) {
      throw new Error("NEWS_API_KEY is not defined");
    }
    return process.env.NEWS_API_KEY;
  }

  get newsApiUrl(): string {
    if (!process.env.NEWS_API_URL) {
      throw new Error("NEWS_API_URL is not defined");
    }
    return process.env.NEWS_API_URL;
  }
}

export const config = new AppConfig();
