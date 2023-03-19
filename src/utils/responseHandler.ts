import { HttpCode, ResponseType, ResponseErrorType } from "@byit/storywar";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = HttpCode.OK
): ResponseType<T> {
  return {
    errorCode: 0,
    message: message ? message : "",
    data,
    statusCode,
    errors: [],
  };
}

export function errorResponse<T>(
  data: T,
  message?: string,
  statusCode: number = HttpCode.NOT_FOUND,
  errors?: ResponseErrorType[]
): ResponseType<T> {
  return {
    errorCode: 1,
    data,
    errors: errors || [],
    message: message ? message : "",
    statusCode,
  };
}

export function rareErrorResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  _req: Request,
  res: Response
) {
  let { statusCode = HttpCode.INTERNAL_SERVER_ERROR } = error;
  let message = "Something went wrong";

  const data = error?.data ? error.data : {};

  if (error.name === "JsonWebTokenError") {
    statusCode = HttpCode.UNAUTHORIZED;
  }

  if (error.message === "No auth token") {
    statusCode = HttpCode.UNAUTHORIZED;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    message = `Prisma Error: ${error?.message}`;
  }

  res.status(statusCode).json(errorResponse(data, message, statusCode));
}
