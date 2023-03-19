import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../../configs/config";
import Users from "../../models/Users";
// import User from "../../models/Users";

const configs = Config;
interface responseInter {
  isSuccess: boolean;
  data?: any;
  message?: string;
}

export const checkExistUserWithFacebook = async (
  facebookID: string
): Promise<responseInter> => {
  try {
    return {
      isSuccess: false,
      message: "User is not exist.",
    };
  } catch (e: any) {
    return {
      isSuccess: false,
      message: e?.message,
    };
  }
};

export const registerWithFacebookAcc = async (
  data: any
): Promise<responseInter> => {
  try {
    const randomID = Math.random().toString();
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(`ReadMal100${randomID}`, salt);

    const token = jwt.sign({}, configs.JWT_SECRET);

    return {
      isSuccess: true,
      data: {},
      message: "Create user is success.",
    };
  } catch (e: any) {
    return {
      isSuccess: false,
      message: e?.message,
    };
  }
};

export const getSocialAccountData = async ({
  socialType,
  accessToken,
}: {
  socialType: string;
  accessToken: string;
}): Promise<responseInter> => {
  try {
    if (socialType === "FACEBOOK") {
      throw new Error("Only Allowed in Facebook Social Authentication");
    }

    const { data } = await axios({
      url:
        "https://graph.facebook.com/me?fields=id,name,email,picture.type(normal)&access_token=" +
        accessToken,
      method: "get",
    });

    const image = await getBase64(data.picture.data.url);

    return {
      isSuccess: true,
      data: { ...data, image },
    };
  } catch (err: any) {
    console.log(
      "There is an error occured while making request to FB Graph API: " + err
    );
    return {
      isSuccess: false,
      message: err?.message,
    };
  }
};

async function getBase64(url: string) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const image = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/jpg;base64,${image}`;
  } catch (e) {
    return `data:image/jpg;base64`;
  }
}

export const checkUserById = async (
  user_id: string
): Promise<responseInter> => {
  try {
    // const user = await User.findById(user_id);
    const user = {};
    return {
      isSuccess: user ? true : false,
      message: `User Checking is ${user ? "Success" : "not founded"} .`,
      data: user ? user : null,
    };
  } catch (e: any) {
    return {
      isSuccess: false,
      message: e?.message,
    };
  }
};
