import { Express, Router } from "express";
import AuthRouter from "./AuthRouter";
import serverConfig from "../configs/server";

/**
 * =================================================================
 * All the routes files are declared in this module.
 * =================================================================
 *
 */

interface RouterListType {
  routeName: string;
  router: Router;
}

const RouterList: RouterListType[] = [
  /**
   * =================================
   * Auth Router
   * =================================
   *
   * @routeName "auth"
   * @example   "/api/v1/auth"
   */
  {
    routeName: "auth",
    router: AuthRouter,
  },
];

const { apiVersion } = serverConfig;

export default (app: Express) => {
  /*=============================================
   =            Authentication Routes          =
   ============================================= */
  RouterList.forEach((item) => {
    app.use(`${apiVersion}/${item.routeName}`, AuthRouter);
  });
  /*=====  End of Authentication Routes  ====== */
};
