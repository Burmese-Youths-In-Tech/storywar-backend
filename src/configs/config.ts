import path from "path";

/*=============================================
=        Dot Evnirontment File Config         =
=============================================*/
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../", "../", ".env") });

const Config = {
  JWT_SECRET: process.env.JWT_SECRET || "BYIT_JWT_SECRET",
  APP_SECRET: process.env.APP_SECRET || "BYIT_APP_SECRET",
  PORT: process.env.PORT || 3000,
};

export default Object.freeze(Config);
