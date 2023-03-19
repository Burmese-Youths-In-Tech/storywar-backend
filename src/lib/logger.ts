import morgan from "morgan";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import moment from "moment-timezone";

// interface IGetUserAuthInfoRequest extends Request {
//   user: {
//     id: string;
//     name: string;
//   };
// }

const accessLogStream = (fileName: string) => {
  const dir = path.join(__dirname, "../", "../", "logs", `${fileName}`);
  return fs.createWriteStream(dir, {
    flags: "a",
  });
};

morgan.token("date", () => {
  return moment().tz("Asia/Yangon").format();
});

morgan.token("user", (req: any) => {
  return req?.user
    ? `UserId:${req.user.id} Name:"${req.user.name}"`
    : '"Guest"';
});

const morganFormat = `[:date[clf]] :method ":url", Status :status, ContentLength :res[content-length] - :response-time ms, :user`;

const getToday = () => moment().tz("Asia/Yangon").format("YYYY-MM-DD");

export default morgan(morganFormat, {
  stream: accessLogStream(`requests/${getToday()}_request.log`),
  skip: function (req: Request, res: Response) {
    return res.statusCode > 400;
  },
});

/**
 * Not Found Log'll write on 404.log
 *
 */
export const notFoundLog = morgan(morganFormat, {
  stream: accessLogStream(`404/${getToday()}_404.log`),
  skip: function (req: Request, res: Response) {
    return res.statusCode !== 404;
  },
});

/**
 * Output Only Error Logs.
 */
export const errorLog = morgan(morganFormat, {
  stream: accessLogStream(`errors/${getToday()}_error.log`),
  skip: function (req: Request, res: Response) {
    return res.statusCode === 404 || res.statusCode < 400;
  },
});
