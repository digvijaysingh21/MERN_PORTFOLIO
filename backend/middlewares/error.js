class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  /**
   * The error code 11000 indicates that an internal error has occurred while performing the operation.
   * This error is usually caused by transient issues with the service
   */

  /**
   * A 400 error code, also known as a "Bad Request" error, is an HTTP status code that indicates the server couldn't process a request due to an error on the client's side.
   * Missing parameters: Required parameters were missing from the request
   * Incorrect request formatting: The request was formatted incorrectly
   * Outdated DNS cache: The DNS cache on your computer contained an old IP address for the site, which no longer exists
   */
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ErrorHandler(message, 400); //400 for bad request
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Invalid Json Web Token, Try Again!`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try  to Login Again!`;
    err = new ErrorHandler(message, 400);
  }
  //   console.log(err);

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
    // console.log(err);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
