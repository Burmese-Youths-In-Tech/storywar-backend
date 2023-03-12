import path from "path";

/*=============================================
=        Dot Evnirontment File Config         =
=============================================*/
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

const serverConfig = {
  apiVersion: "/api/v1",
  majorVersion: "v1",
  version: "0.0.1",
  author: "Burmese Youths In Tech",
  port: process.env.PORT || 3000,
};

export default serverConfig;
