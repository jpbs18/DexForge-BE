import express, { Application, Request, Response, NextFunction } from "express";
import request from "supertest";
import { ApiError, errorHandler } from "../../middlewares/errorHandler";

const app: Application = express();

app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError("Test error", 500));
});

app.get("/generic-error", (req: Request, res: Response, next: NextFunction) => {
  next(new Error("Something went wrong"));
});

app.use(errorHandler);

describe("errorHandler middleware", () => {
  it("should catch ApiError and respond with custom status", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Test error");
    expect(res.body).toHaveProperty("success", false);
  });

  it("should catch generic Error and respond with 500 Internal Server Error", async () => {
    const res = await request(app).get("/generic-error");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
    expect(res.body).toHaveProperty("success", false);
  });
});
