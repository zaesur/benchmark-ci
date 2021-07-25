import { ErrorRequestHandler } from "express";
import { HttpError }  from "http-errors";

const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next): void => {
  console.error(error.message);

  if (error instanceof HttpError) {
    const { status, message } = error;
    response.status(status).send({ status, message, });
  } else {
    response.sendStatus(500);
  }
};

export default errorMiddleware;
