import express from "express";
import request from "supertest";
import { limiterConfig } from "../../config/security";

const app = express();
app.use(limiterConfig);
app.get("/limited", (req, res) => res.send("ok"));

describe("Rate limiter middleware", () => {
  it("should allow requests under the limit", async () => {
    const res = await request(app).get("/limited");
    expect(res.status).toBe(200);
  });

  it("should block requests exceeding the limit", async () => {
    for (let i = 0; i < 60; i++) await request(app).get("/limited"); 

    const res = await request(app).get("/limited"); 
    expect(res.status).toBe(429);
    expect(res.body.message).toContain("Too many requests");
  });
});
