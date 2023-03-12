import morgan from "morgan";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import moment from "moment-timezone";

interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: string;
    name: string;
  };
}

const accessLogStream = (fileName: string) =>
  fs.createWriteStream(path.join(__dirname, "../../", "logs", `${fileName}`), {
    flags: "a",
  });

morgan.token("date", () => {
  return moment().tz("Asia/Yangon").format();
});

morgan.token("user", (req: IGetUserAuthInfoRequest) => {
  return req?.user
    ? `UserId:${req.user.id} Name:"${req.user.name}"`
    : '"Guest"';
});

const morganFormat = `[:date[clf]] :method ":url", Status :status, ContentLength :res[content-length] - :response-time ms, :user`;

export default morgan(morganFormat, {
  stream: accessLogStream("request.log"),
  skip: function (req: Request, res: Response) {
    return res.statusCode > 400;
  },
});

/**
 * Not Found Log'll write on 404.log
 *
 */
export const notFoundLog = morgan(morganFormat, {
  stream: accessLogStream("404.log"),
  skip: function (req: Request, res: Response) {
    return res.statusCode !== 404;
  },
});

/**
 * Output Only Error Logs.
 */
export const errorLog = morgan(morganFormat, {
  stream: accessLogStream("error.log"),
  skip: function (req: IGetUserAuthInfoRequest, res: Response) {
    return res.statusCode < 400 && res.statusCode !== 404;
  },
});
