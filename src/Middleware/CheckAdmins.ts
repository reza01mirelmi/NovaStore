module.exports = async (req, res, next) => {
  try {
    const isAdmin = req.user.role == "ADMIN";

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
