import { Router } from "express";
import passport from "passport";
import AuthController from "../controller/Auth/AuthController";
import { COMMON_LOGIN_VALIDATION } from "../controller/Auth/AuthValidation";
import CheckAuthMiddleware from "../middleware/CheckAuthMiddleware";
/**
 * =================================================================
 * All the Auth Routes files are declared
 * =================================================================
 *
 * @example "api/v1/auth" will be execute AuthController.GetUser
 *
 */
const AuthRouter: Router = Router();

/**
 * =================================================================
 * Login Routes For Common Way
 * =================================================================
 * @route /api/v{vNum}/auth/login
 *
 */
AuthRouter.post(
  "/login",
  ...COMMON_LOGIN_VALIDATION,
  AuthController.COMMON_LOGIN
);

/**
 * =================================================================
 * Register Routes For Common Way
 * =================================================================
 * @doc : It's only just for testing purposes and making rigster accounts.
 * @route /api/v{vNum}/auth/register
 *
 */
AuthRouter.post(
  "/register",
  ...COMMON_LOGIN_VALIDATION,
  AuthController.COMMON_REGISTER
);

/**
 * =================================================================
 * Register Routes For Common Way
 * =================================================================
 * @doc : It's only just for testing purposes and making rigster accounts.
 * @route /api/v{vNum}/auth/register
 *
 */
AuthRouter.get("/me", CheckAuthMiddleware, AuthController.GET_ME);

/**
 * =================================================================
 * Social Login Routes
 * =================================================================
 * @route /api/v{vNum}/auth/social
 *
 * For Facebook Social Login Request
 * @route /api/v{vNum}/social/facebook
 *
 * For Google Social Login Request
 * @route /api/v{vNum}/social/google
 *
 */
// AuthRouter.post("/social/:socialType", AuthController.SOCIAL_LOGIN);

/**
 * =================================================================
 * Facebook Login with Callback URL
 * =================================================================
 * @doc : It's only just for testing purposes and making rigster accounts.
 * @route /api/v{vNum}/auth/facebook-login
 *
 */
AuthRouter.get("/facebook-login", passport.authenticate("facebook"));
AuthRouter.get(
  "/social/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/404",
  }),
  AuthController.LOGIN_WITH_FACEBOOK_CALLBACK
);

export default AuthRouter;
