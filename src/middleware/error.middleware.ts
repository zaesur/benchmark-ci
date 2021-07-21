import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

const errorMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (createError.isHttpError(error)) {
    const { status, message } = error;
    response.status(status).send({ error, message });
  } else {
    next(error);
  }
};

export default errorMiddleware;
