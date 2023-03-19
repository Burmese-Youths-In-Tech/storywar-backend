import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import prisma from "./lib/prisma";
import https from "https";
import http from "http";

/*=============================================
=        All Library Module Imported          =
=============================================*/
import logger, { notFoundLog, errorLog } from "./lib/logger";

/*=============================================
=        All Server Backend Configs           =
=============================================*/
import serverConfig from "./configs/server";

/*=============================================
=        Dot Evnirontment File Config         =
=============================================*/
/**
 * To configure environment variables
 * @doc: https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
 *
 */
import * as dotenv from "dotenv";
import setRootRouter from "./routes/RouteIndex";
import path from "path";
import { rareErrorResponse } from "./utils/responseHandler";
import { AuthCollectionType, HttpCode } from "@byit/storywar";
import passport from "passport";
import passportStrategy from "./lib/passport";
import Config from "./configs/config";
import fbPassport from "./lib/fbPassport";

dotenv.config({ path: path.join("../", ".env") });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends AuthCollectionType {
      id: number;
      name: string;
      email: string;
      profilePic: string;
      role: string;
      isBanedUser: boolean;
      token: string;
    }
  }
}

const key = fs.readFileSync(
  path.join(__dirname, "../", "localhost-key.pem"),
  "utf-8"
);
const cert = fs.readFileSync(
  path.join(__dirname, "../", "localhost.pem"),
  "utf-8"
);

prisma
  .$connect()
  .then(() => {
    const app: Express = express();
    // Require Locale Passport Config
    passportStrategy(passport);
    fbPassport(passport);

    /**
     * ==================================================
     * HTTP request logger middleware for node.js
     * ==================================================ß
     *
     * @doc : https://github.com/expressjs/morgan#readme
     *
     */
    app.use(logger);
    app.use(notFoundLog);
    app.use(errorLog);

    console.log("Database connection Started");

    /**
     *  Express.js Use Static Files
     *
     */
    app.use(express.static(path.join(__dirname, "../", "public")));

    /**
     *  Express.js security with HTTP headers
     *  It's not a silver bullet, but it can help!
     *  @doc : https://helmetjs.github.io/
     *
     */
    app.use(helmet());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    /**
     * For Cross Origin Resource Sharing
     * @doc : https://github.com/expressjs/cors#readme
     */
    app.use(cors());

    /**
     * First Server Configuration Data
     * Response
     */
    app.get("/", (req: Request, res: Response) => {
      res.status(HttpCode.OK).json({
        errorCode: 0,
        data: serverConfig,
        message: "Server Info",
        statusCode: HttpCode.OK,
      });
    });

    /**
     * =================================================
     * Router System.
     * =================================================
     *
     * @description : defines all routes as RootRoute
     * @folder '/src/routes/RouteIndex'
     */
    setRootRouter(app);

    app.use("*", (_req: Request, res: Response) => {
      res.status(HttpCode.NOT_FOUND).json({
        errorCode: 0,
        message: "Request Not Found 404",
        statusCode: HttpCode.NOT_FOUND,
      });
    });

    /**
     * Final Manage Error Exception
     * @desc : Finally Response Message
     * @return { JSON }
     */
    app.use(rareErrorResponse);
    const listenServer = () => {
      console.log(`Now Listening on Port ${Config.PORT}`);
    };
    http.createServer(app).listen(Config.PORT, listenServer);
    https.createServer({ key, cert }, app).listen(443, listenServer);

    // Listening on http://localhost:{serverConfig.port}
    https.createServer({ key, cert }, app).listen();
  })
  .catch(console.log);

prisma.$on("beforeExit", () => {
  console.log("Disconnecting from Database");
  prisma.$disconnect();
});
