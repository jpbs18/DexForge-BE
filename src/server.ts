import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./config/database";
import pokemonRoutes from "./modules/pokemon/route";
import newsRoutes from "./modules/news/route";
import { corsConfig, limiterConfig } from "./config/security";
import { errorHandler } from "./middlewares/errorHandler";
import { sanitizer } from "./middlewares/sanitizeHandler";
import { config } from "./config/configuration";
import { notFoundHandler } from "./middlewares/notFoundHandler";

connectDB();

const app: Application = express();
app.set("trust proxy", 1);

app.use(cors(corsConfig));
app.use(limiterConfig);
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(sanitizer);

app.use("/api/pokemons", pokemonRoutes);
app.use("/api/news", newsRoutes);
app.all("/*splat", notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () =>
  console.log(`🚀 Server running on port ${config.port}`)
);

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig, () => {
    server.close(() => {
      console.log("Server closed gracefully");
      process.exit(0);
    });
  });
});
