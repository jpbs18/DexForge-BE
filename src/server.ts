import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import connectDB from "./config/db";
import pokemonRoutes from "./modules/pokemon/route";
import newsRoutes from "./modules/news/route";
import { corsConfig, limiterConfig } from "./config/app";
import { errorHandler } from "./middlewares/errorHandler";
import { sanitizer } from "./middlewares/sanitizeHandler";

dotenv.config();
connectDB();

const app: Application = express();
app.set("trust proxy", 1);

app.use(cors(corsConfig));
app.use(rateLimit(limiterConfig));
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(sanitizer);

app.use("/api/pokemons", pokemonRoutes);
app.use("/api/news", newsRoutes);
app.use(errorHandler);

const server = app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Express server closed");
    process.exit(0);
  });
});
