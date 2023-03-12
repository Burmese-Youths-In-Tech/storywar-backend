import express, { Express } from "express";
import helmet from "helmet";

/*=============================================
=        All Server Backend Configs           =
=============================================*/
// import serverConfig from "./src/configs/server";

/*=============================================
=        Dot Evnirontment File Config         =
=============================================*/
/**
 * To configure environment variables
 * @doc: https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
 *
 */
import * as dotenv from "dotenv";
dotenv.config();

const app: Express = express();

/**
 *  Express.js security with HTTP headers
 *  It's not a silver bullet, but it can help!
 *  @doc : https://helmetjs.github.io/
 *
 */
app.use(helmet());
