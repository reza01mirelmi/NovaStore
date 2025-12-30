const errorhandling = (err, req, res, next) => {
  console.error("Error :", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  res.status(statusCode).json({ status: err.status || "error", message });
};

module.exports = errorhandling;
