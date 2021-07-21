import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const errorMiddleware = (
  error: Error | HttpError,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (error instanceof HttpError) {
    const { status, message } = error;
    response.status(status).send({ status, message, })
  } else {
    console.log(error.message, '\n', error.stack);
    response.sendStatus(500);
  }
};

export default errorMiddleware;
