import { Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import { FilterXSS } from "xss";

const xssFilter = new FilterXSS({
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
});

function sanitizeObject(obj: any): any {
  if (typeof obj === "string") return xssFilter.process(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      obj[key] = sanitizeObject(obj[key]);
    }
  }

  return obj;
}

export function sanitizer(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeObject(sanitize(req.body));

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = sanitizeObject(sanitize(req.query[key]));
    }
  }

  if (req.params) {
    for (const key in req.params) {
      req.params[key] = sanitizeObject(sanitize(req.params[key]));
    }
  }

  next();
}
