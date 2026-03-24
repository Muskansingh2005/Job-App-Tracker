export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server error";

  // Handle specific MongoDB errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  console.error(`[${statusCode}] ${message}:`, err.stack);

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};
