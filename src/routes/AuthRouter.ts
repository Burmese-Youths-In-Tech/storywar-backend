import { Response, Router, Request } from "express";

const AuthRouter: Router = Router();

AuthRouter.get("", (req: Request, res: Response) => {
  res.json({
    errorCode: null,
    data: "Hello World",
    message: "Auth Response Data",
  });
});

export default AuthRouter;
