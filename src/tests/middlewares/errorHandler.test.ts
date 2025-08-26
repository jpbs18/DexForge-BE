import express, { Application, Request, Response, NextFunction } from "express";
import request from "supertest";
import { ApiError, errorHandler } from "../../middlewares/errorHandler";

const app: Application = express();

app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError("Test error", 500));
});
app.use(errorHandler);

describe("errorHandler middleware", () => {
  it("should catch errors and respond with 500", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Test error");
    expect(res.body).toHaveProperty("success", false);
  });
});
