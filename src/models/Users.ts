import { User } from "@prisma/client";
import { SocialAccType } from "@byit/storywar";
import prisma from "../lib/prisma";

export const getUser = async (): Promise<User[]> => {
  const user = await prisma.user.findMany();
  return user;
};

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (user: CreateUserProps): Promise<User> => {
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      profilePic: "",
      role: "USER",
      password: user.password,
      tokens: [],
      fcmTokens: [],
    },
  });

  return newUser;
};

export const deleteAllUser = async () => {
  try {
    const newUser = await prisma.user.deleteMany();
    return newUser;
  } catch (e) {
    console.log(e);
  }
};

export const getUserById = async (userId: number): Promise<User> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });
  return user;
};

export const getUserByEmail = async (
  userEmail: string
): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: { email: userEmail },
  });
  return user;
};

interface UpdateTokenProps {
  token: string;
  user: User;
}
export const updateToken = async ({ token, user }: UpdateTokenProps) => {
  const tokenLimit = 4;
  let updateTokens = [];
  if (user.tokens.length < tokenLimit) {
    updateTokens = [...user.tokens, token];
  } else {
    updateTokens = [
      ...user.tokens.filter((token, index) => index !== 0),
      token,
    ];
  }
  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      tokens: updateTokens,
    },
  });

  console.log(updateUser);
};

interface FindSocialAccountType {
  socialId: string;
  socialType: keyof typeof SocialAccType;
}
export const findBySocialAccount = async ({
  socialId,
  socialType,
}: FindSocialAccountType): Promise<boolean> => {
  return false;
};

const Users = {
  getUser,
  createUser,
  getUserById,
  getUserByEmail,
  updateToken,
};

export default Users;
