import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import authorModel from "../Models/Models_Users";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization")?.split(" ");

    if (!authHeader || authHeader.length !== 2) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This API requires authentication.",
      });
    }

    const token = authHeader[1];

    try {
      const jwtpayload = jwt.verify(
        token,
        process.env.SECRET_JWT!,
      ) as JwtPayload;

      const user = await authorModel.findById(jwtpayload.id).lean();

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      Reflect.deleteProperty(user, "password");

      req.user = user;

      next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            error: "token_expired",
            message: "Your token has expired. Please login again.",
          });
        }
        return res.status(401).json({
          success: false,
          error: "invalid_token",
          message: "Your token is invalid. Please login again.",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};
