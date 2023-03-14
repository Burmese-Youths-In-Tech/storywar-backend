import express, { Express, Request, Response } from "express";
import helmet from "helmet";
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

dotenv.config({ path: path.join("../", ".env") });

const app: Express = express();

/**
 *  Express.js security with HTTP headers
 *  It's not a silver bullet, but it can help!
 *  @doc : https://helmetjs.github.io/
 *
 */
app.use(helmet());

/**
 * HTTP request logger middleware for node.js
 * @doc : https://github.com/expressjs/morgan#readme
 */
app.use(logger);
app.use(notFoundLog);
app.use(errorLog);

/**
 * First Server Configuration Data
 * Response
 */
app.get("/", (req: Request, res: Response) => {
  res.json(serverConfig);
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

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    errorCode: 0,
    message: "Request Not Found 404",
    statusCode: 404,
  });
});

// Listening on http://localhost:{serverConfig.port}
app.listen(serverConfig.port, () => {
  console.log(`Now Listening on Port ${serverConfig.port}`);
});
