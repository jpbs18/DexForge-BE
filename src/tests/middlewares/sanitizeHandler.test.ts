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

  it("should sanitize nested objects", async () => {
    const payload = { user: { bio: "<img src=x onerror=alert(1) />" } };
    const res = await request(app).post("/sanitize").send(payload);
    expect(res.body.user.bio).not.toContain("onerror");
  });

  it("should sanitize arrays", async () => {
    const payload = { tags: ["<b>bold</b>", "<i>italic</i>"] };
    const res = await request(app).post("/sanitize").send(payload);
    res.body.tags.forEach((tag: string) => {
      expect(tag).not.toContain("<");
    });
  });

  it("should sanitize query parameters", async () => {
    app.get("/sanitize", (req, res) => res.json(req.query));
    const query = { search: "<img src=x onerror=alert(1)>" };
    const res = await request(app).get("/sanitize").query(query);

    expect(res.body.search).not.toContain("<script>");
    expect(res.body.search).toContain("alert(1)");
  });
});
