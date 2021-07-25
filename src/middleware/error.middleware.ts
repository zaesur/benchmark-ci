import { NextFunction, Request, Response } from "express";
import { HttpError }  from "http-errors";

const errorMiddleware = (
  error: Error | HttpError,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.error(error.message);

  if (error instanceof HttpError) {
    const { status, message } = error;
    response.status(status).send({ status, message, });
  } else {
    response.sendStatus(500);
  }
};

export default errorMiddleware;
