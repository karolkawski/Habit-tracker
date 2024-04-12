import { Document, Model } from "mongoose";

type UserAttributes = {
  login: string;
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
  role: string;
};

export type UserPublicData = {
  login: string;
  name: string;
  email: string;
  role: string;
};

export type UserMethods = {
  generateAuthToken(): Promise<string>;
  getPublicData(): Promise<UserPublicData>;
};

export type UserDocument = UserAttributes & UserMethods & Document;

export type UserModel = Model<UserDocument> & {
  // eslint-disable-next-line no-unused-vars
  findByCredentials(loginOrEmail: string, password: string): Promise<UserDocument>;
};
