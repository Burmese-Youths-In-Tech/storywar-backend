import path from "path";

/*=============================================
=        Dot Evnirontment File Config         =
=============================================*/
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../", "../", ".env") });

const MAJOR_VERSION = "v1";

const serverConfig = {
  title: process.env.APP_NAME || "Burmese Youths In Tech App",
  apiVersion: `/api/${MAJOR_VERSION}`,
  majorVersion: MAJOR_VERSION,
  version: "0.0.1",
  author: "Burmese Youths In Tech",
  port: process.env.PORT || 3000,
  isMentain: false,
};

export default serverConfig;
