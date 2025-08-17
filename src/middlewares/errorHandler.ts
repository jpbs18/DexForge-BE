import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const statusCode = err.status || 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({ message });
}
