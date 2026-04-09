import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

const validObjectId =
  (paramName: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const idFromParams = req.params[paramName];
      const idFromBody = req.body?.[paramName];

      if (!idFromParams && !idFromBody) {
        return res.status(400).json({ message: `${paramName} not found❌` });
      }

      if (idFromParams && !isValidObjectId(idFromParams)) {
        return res
          .status(400)
          .json({ message: `${paramName} in params is not valid ❌` });
      }

      if (idFromBody && !isValidObjectId(idFromBody)) {
        return res
          .status(400)
          .json({ message: `${paramName} in body is not valid ❌` });
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
export default validObjectId;
