import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};
