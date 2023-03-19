import { PassportStatic } from "passport";
import passportJWT from "passport-jwt";
import Config from "../configs/config";
// import passportLocal from "passport-local";
// import bcrypt from "bcrypt";
// import Users from "../models/Users";
// import { User } from "@prisma/client";

/**
 * OAuth JWT Strategy Overview
 *
 * - Check if it's a returning user.
 *   - If returning user, sign in and we are done.
 *   - Else check if there is an existing account with user's email.
 *     - If there is, return an error message.
 *     - Else create a new account.
 *
 */

export default function (passport: PassportStatic) {
  const JWTStrategy = passportJWT.Strategy;
  const ExtractJWT = passportJWT.ExtractJwt;

  const PassportJWTStrategy = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.JWT_SECRET,
  };

  passport.use(
    new JWTStrategy(PassportJWTStrategy, async function (jwtPayload, cb) {
      return jwtPayload.id
        ? cb(null, jwtPayload)
        : cb(new Error("Not Valid User Authenticate"), false, {
            message: "Not Valid User Authenticate",
          });
    })
  );

  /**
   * This module lets you authenticate using a username
   * and password in your Node.js applications
   * @doc : http://www.passportjs.org/packages/passport-local/
   */

  // const PassportLocalStrategy = {
  //   usernameField: "email",
  //   passwordField: "password",
  // };

  /**
   * @desc: When User Login (Authentication )
   * @route 'api/v{number}/auth'
   * @method POST
   */

  // const LocalStrategy = passportLocal.Strategy;

  // passport.use(
  //   new LocalStrategy(PassportLocalStrategy, async (email, password, cb) => {
  //     try {
  //       console.log("Comming Local Strategy");

  //       const user = await Users.getUserByEmail(email);
  //       console.log("Get User By Email");
  //       if (!user) return cb(new Error("Not Found User"), false);

  //       bcrypt.compare(password, user.password, (err, isMatch) => {
  //         if (err) throw err;
  //         if (isMatch) {
  //           return cb(null, user);
  //         } else {
  //           return cb(new Error("Incorrect Password"), false);
  //         }
  //       });
  //     } catch (e) {
  //       console.log("Error", e);
  //       cb(new Error("Incorrect email or password."), false);
  //     }
  //   })
  // );

  // passport.serializeUser(function (user, done) {
  //   console.log("serialized: ", user); //logged when credentials matched.
  //   return done(null, user);
  // });

  // passport.deserializeUser(function (user: any, done) {
  //   return done(null, user);
  // });
}
