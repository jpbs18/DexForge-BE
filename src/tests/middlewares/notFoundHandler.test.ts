import request from "supertest";
import express, { Application } from "express";
import { notFoundHandler } from "../../middlewares/notFoundHandler";
import { errorHandler } from "../../middlewares/errorHandler";

const app: Application = express();
app.all("/*splat", notFoundHandler);
app.use(errorHandler);

describe("notFoundHandler", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Route not found");
  });
});
