import express from "express";
import request from "supertest";
import cors from "cors";
import { corsConfig } from "../../config/security";

const app = express();
app.use(cors(corsConfig));
app.get("/test", (req, res) => res.send("ok"));

describe("CORS middleware", () => {
  it("should allow requests from allowed origins", async () => {
    const res = await request(app)
      .get("/test")
      .set("Origin", "http://localhost:3000");
    
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("should block requests from disallowed origins", async () => {
    const res = await request(app)
      .get("/test")
      .set("Origin", "http://evil.com");
    
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
