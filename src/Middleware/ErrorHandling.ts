import { Request, Response, NextFunction } from "express";

const errorhandling = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error :", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  res.status(statusCode).json({ status: err.status || "error", message });
};

export default errorhandling;
