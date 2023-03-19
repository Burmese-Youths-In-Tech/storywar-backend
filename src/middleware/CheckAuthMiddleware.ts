import { NextFunction, Request, Response } from "express";
import Users from "../models/Users";
import { errorResponse } from "../utils/responseHandler";
import passport from "passport";
import { AuthCollectionType, HttpCode } from "@byit/storywar";

export default (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: any, user: AuthCollectionType, info: unknown) => {
      // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
      if (err || !user) {
        // PASS THE ERROR OBJECT TO THE NEXT ROUTE i.e THE APP'S COMMON ERROR HANDLING MIDDLEWARE
        return res
          .status(HttpCode.UNAUTHORIZED)
          .json(
            errorResponse(
              null,
              err?.message || "Token is not valid",
              HttpCode.UNAUTHORIZED
            )
          );
      } else {
        req.user = user;

        // Get Request Bearer Token , example ['Bearer', 'tokenCode...']
        const tokenText = req.headers?.authorization;
        const requestToken = tokenText?.replace(/BEARER/g, "").trim();

        // Fetch user data in db, bcoz all we gotta make sure for single device
        const userInsideDb = await Users.getUserById(user.id);

        if (!userInsideDb) {
          return res
            .status(HttpCode.UNAUTHORIZED)
            .json(
              errorResponse(null, "User Not Found!!", HttpCode.UNAUTHORIZED)
            );
        }

        // If same token, we should go next step
        const isMatchToken = userInsideDb.tokens.some(
          (token) => token === requestToken
        );

        if (isMatchToken) {
          return next();
        }

        // Else We must show expired message.
        const expiredMessage = "Another Devices already Logged in 4 devices!!";
        return res
          .status(HttpCode.UNAUTHORIZED)
          .json(errorResponse(null, expiredMessage, HttpCode.UNAUTHORIZED));
      }
    }
  )(req, res, next);
};
