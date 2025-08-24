import rateLimit from "express-rate-limit";

export const corsConfig = {
  origin: ["http://localhost:3000", "https://dex-forge.vercel.app"],
  methods: ["GET"],
  allowedHeaders: ["Content-Type"],
};

export const limiterConfig = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: "Too many requests, please try again later." },
});
