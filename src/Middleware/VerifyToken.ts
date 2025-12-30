const jwt = require("jsonwebtoken");
const userModele = require("./../Models/Models_Users");

module.exports = async (req, res, next) => {
  try {
    const authHedear = req.header("Authorization")?.split(" ");

    if (!authHedear || authHedear.length !== 2) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This API requires authentication.",
      });
    }

    const token = authHedear[1];

    try {
      const jwtpayload = jwt.verify(token, process.env.SECRET_JWT);

      const user = await userModele.findById(jwtpayload.id).lean();

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      Reflect.deleteProperty(user, "password");

      req.user = user;

      next();
    } catch (err) {
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
  } catch (err) {
    next(err);
  }
};
