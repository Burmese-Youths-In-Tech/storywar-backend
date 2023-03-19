/*
 * This module lets you authenticate endpoints using a JSON web token.
 * It is intended to be used to secure RESTful endpoints without sessions.
 * @doc : https://www.npmjs.com/package/passport-jwt
 *
 * Facebook Passport
 * @doc : https://github.com/jaredhanson/passport-facebook
 */

// import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import { PassportStatic } from "passport";
import passportFacebook from "passport-facebook";
import config from "../configs/config";

/*=============================================
=        Dot Evnirontment File Config         =
=============================================*/
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../", "../", ".env") });

const facebookStrategy = passportFacebook.Strategy;

// Model Import
// const User = require("../src/User/UserModel");
// const {
//   updateCurrentToken,
//   updateCurrentTokenAndFacebookId,
// } = require("../src/Auth/AuthHelper");

const facebookParams = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: [
    "id",
    "displayName",
    "name",
    // "gender",
    // "picture.type(large)",
    "email",
  ],
};

// console.log('Facebook Parmas', facebookParams)

export default function (passport: PassportStatic) {
  passport.serializeUser(function (jwtToken, cb) {
    console.log("Inside Serialize User, Return Token");
    // console.log('And get user data => ', user)
    cb(null, jwtToken);
  });

  // passport.deserializeUser(function (id, cb) {
  // 	console.log('Inside deserialize User')
  // 	console.log('And get idect => ', id)
  // 	cb(null, id)
  // })

  passport.use(
    new facebookStrategy(
      facebookParams as any,
      async (
        _token: string,
        _refreshToken: string,
        profile: any,
        done: any
      ) => {
        // When Callback
        // console.log('\ntoken', token )
        // console.log('\nrefreshToken', refreshToken )
        // console.log('\nprofile => \n', profile)

        // First We need to check if exist email
        try {
          //   const isGetEmailFromFbAccount = profile.emails.length > 0;
          //   const emailFromFb = isGetEmailFromFbAccount
          //     ? profile.emails[0].value
          //     : null;

          // Checking If Already Exist User with Facebook Id
          //   const isExistUserWithFbId = await User.find({
          //     facebook_social_id: profile.id,
          //   });

          //   if (isExistUserWithFbId) {
          //     const jwtToken = jwt.sign(
          //       getUserData(isExistUserWithFbId),
          //       config.JWT_SECRET
          //     );
          //     await updateCurrentToken(isExistUserWithFbId._id, jwtToken);
          //     return done(null, jwtToken);
          //   }

          //   if (isGetEmailFromFbAccount) {
          //     const isExistUserWithEmail = await User.findOne({
          //       email: emailFromFb,
          //     });
          //     // const isExistUserWithFbId = await User.findOne({ facebook_social_id: profile.id})

          //     if (isExistUserWithEmail) {
          //       const jwtToken = jwt.sign(
          //         getUserData(isExistUserWithEmail),
          //         config.JWT_SECRET
          //       );
          //       await updateCurrentTokenAndFacebookId(
          //         isExistUserWithEmail._id,
          //         profile.id,
          //         jwtToken
          //       );
          //       return done(null, jwtToken);
          //     }
          //   }

          const salt = await bcrypt.genSalt(10);
          const password = await bcrypt.hash(config.APP_SECRET, salt);

          console.log(password);

          console.log("Profile");

          console.log(profile);
          //   const user = new User({
          //     name: profile.displayName,
          //     email: emailFromFb,
          //     password: password,
          //     facebook_social_id: profile.id,
          //   });
          //   await user.save();
          //   const currentToken = jwt.sign(getUserData(user), config.JWT_SECRET);
          //   await updateCurrentToken(user._id, currentToken);
          return done(null, "Hello World");
        } catch (e) {
          console.log("Error Inside Facebook Authen", e);
          return done(e);
        }
      }
    )
  );
}
