/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserDocument, UserModel } from "../types/models/User";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    login: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    role: {
      type: String,
      default: "User",
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.getPublicData = async function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "somename");
  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.statics.findByCredentials = async (loginOrEmail, password) => {
  const user = await User.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
