import { Request, Response, NextFunction } from "express";

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user?.role === "ADMIN";

    if (isAdmin) {
      return next();
    }

    return res.status(403).json({
      message:
        "You are not an administrator and do not have permission to access this section.❌",
    });
  } catch (err) {
    next(err);
  }
};

export default checkAdmin;
