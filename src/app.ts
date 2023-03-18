import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import prisma from "./lib/prisma";

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

dotenv.config({ path: path.join("../", ".env") });

const app: Express = express();

prisma
  .$connect()
  .then(() => {
    console.log("Database connection Started");
    /**
     *  Express.js security with HTTP headers
     *  It's not a silver bullet, but it can help!
     *  @doc : https://helmetjs.github.io/
     *
     */
    app.use(helmet());

    /**
     * First Server Configuration Data
     * Response
     */
    app.get("/", (req: Request, res: Response) => {
      res
        .status(200)
        .json({ errorCode: 0, data: serverConfig, message: "Server Info" });
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
      res.status(404).json({
        errorCode: 0,
        message: "Request Not Found 404",
        statusCode: 404,
      });
    });

    /**
     * Final Manage Error Exception
     * @desc : Finally Response Message
     * @return { JSON }
     */
    app.use(rareErrorResponse);

    /**
     * HTTP request logger middleware for node.js
     * @doc : https://github.com/expressjs/morgan#readme
     */
    app.use(logger);
    app.use(notFoundLog);
    app.use(errorLog);

    // Listening on http://localhost:{serverConfig.port}
    app.listen(serverConfig.port, () => {
      console.log(`Now Listening on Port ${serverConfig.port}`);
    });
  })
  .catch(console.log);

prisma.$on("beforeExit", () => {
  console.log("Disconnecting from Database");
  prisma.$disconnect();
});
