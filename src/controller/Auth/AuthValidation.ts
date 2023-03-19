import { HttpCode, ResponseErrorType } from "@byit/storywar";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { errorResponse } from "../../utils/responseHandler";

export const COMMON_LOGIN_VALIDATION = [
  body("email").isEmail().normalizeEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    // Find the validation errors in this request and
    // wraps them in an object with handy functions

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json(
          errorResponse(
            null,
            "Form Validation is invalid",
            HttpCode.BAD_REQUEST,
            errors.array() as ResponseErrorType[]
          )
        );
    } else {
      next();
    }
  },
];
