import express, { Application } from "express";
import request from "supertest";
import { sanitizer } from "../../middlewares/sanitizeHandler";

const app: Application = express();
app.use(express.json());
app.use(sanitizer);
app.post("/sanitize", (req, res) => {
  res.json(req.body);
});

describe("sanitizer middleware", () => {
  it("should sanitize request body", async () => {
    const payload = { name: "<script>alert(1)</script>" };
    const res = await request(app).post("/sanitize").send(payload);
    expect(res.body.name).not.toContain("<script>");
  });
});
