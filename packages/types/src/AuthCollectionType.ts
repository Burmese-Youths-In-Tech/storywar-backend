interface AuthCollectionType {
  id: number;
  name: string;
  email: string;
  profilePic: string;
  role: string;
  isBanedUser: boolean;
  token: string;
}

export default AuthCollectionType;
