import { Response, Request } from "express";
import { AuthCollectionType, HttpCode } from "@byit/storywar";
import { User } from "@prisma/client";
import Users from "../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../configs/config";
import { errorResponse, successResponse } from "../../utils/responseHandler";
import { collectionHelper } from "../../utils/collectionHelper";
import { AuthCollections } from "./AuthCollections";
// import { getSocialAccountData } from "./AuthService";

/**
 * =================================================================
 * All the Auth Controller will be declared
 * =================================================================
 *
 *
 */

const COMMON_LOGIN = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Users.getUserByEmail(email);
  if (!user) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json(errorResponse(null, "Email is Not Found.", HttpCode.BAD_REQUEST));
  }

  bcrypt.compare(password, user.password, async (err, isMatch) => {
    if (err) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json(
          errorResponse(
            null,
            err?.message || "Something went wrong in password",
            HttpCode.BAD_REQUEST
          )
        );
    }

    if (isMatch) {
      const jwtToken = jwt.sign(
        collectionHelper(user, AuthCollections),
        config.JWT_SECRET
      );

      const data: AuthCollectionType = {
        ...collectionHelper(user, AuthCollections),
        token: jwtToken,
      };

      await Users.updateToken({ user, token: jwtToken });

      return res
        .status(HttpCode.OK)
        .json(successResponse(data, "Successfully Authentication"));
    } else {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json(errorResponse(null, "Incorrect Password", HttpCode.BAD_REQUEST));
    }
  });
};

const SOCIAL_LOGIN = async (req: Request, res: Response) => {
  // const socialType = req.query.socialType as string;
  // const accessToken = req.body.accessToken;
  // const _fcmToken = req.body.fcm;
  // const _fbData = await getSocialAccountData({ accessToken, socialType });
  // const _successMessage = "Sucesssfully login with facebook account.";

  res
    .status(HttpCode.OK)
    .json({ errorCode: 1, data: null, message: "Hello World" });
};

const COMMON_REGISTER = async (req: Request, res: Response) => {
  const email = req.body.email;

  const user = await Users.getUserByEmail(email);
  if (user) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json(
        errorResponse(null, "Email is Already Found.", HttpCode.BAD_REQUEST)
      );
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const newUser = await Users.createUser({
      name: email?.split("@")[0] || "User",
      email: email || "",
      password: password,
    });

    res
      .status(HttpCode.OK)
      .json(successResponse(newUser, "Successfully Register"));
  } catch (e: any) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json(
        errorResponse(
          null,
          e?.message || "Something Went Wrong",
          HttpCode.BAD_REQUEST
        )
      );
  }
};

const GET_ME = async (req: Request, res: Response) => {
  const user = req.user?.id ? await Users.getUserById(req.user.id) : null;
  if (!user) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json(errorResponse(null, "Cant Find User!!", HttpCode.BAD_REQUEST));
  }

  const data: AuthCollectionType = {
    ...collectionHelper(user, AuthCollections),
    token: user.tokens.length > 0 ? user.tokens[user.tokens.length - 1] : "",
  };

  return res
    .status(HttpCode.OK)
    .json(successResponse(data, "Successfully Fetching Get Me Info"));
};

const LOGIN_WITH_FACEBOOK_CALLBACK = async (req: Request, res: Response) => {
  // if (process.env.WEB_APP_SOCIAL_LOGIN_URL) {
  //   res.redirect(process.env.WEB_APP_SOCIAL_LOGIN_URL + "?token=" + req.user);
  //   return;
  // }

  res.json({ token: req.user });
};

const AuthController = {
  COMMON_LOGIN,
  SOCIAL_LOGIN,
  COMMON_REGISTER,
  LOGIN_WITH_FACEBOOK_CALLBACK,
  GET_ME,
};

export default AuthController;
