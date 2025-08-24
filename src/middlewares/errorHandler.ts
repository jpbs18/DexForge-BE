import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
