import mongoose, { Document, Model, Schema } from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type UserAttributes = {
    login: string;
    name: string;
    email: string;
    password: string;
    tokens: {token: string}[],
    role: string
}

type UserPublicData = {
    login: string;
    name: string;
    email: string;
    role: string;
  };

type UserMethods = {
    generateAuthToken(): Promise<string>,
    getPublicData(): Promise<UserPublicData>
}

type UserDocument = UserAttributes & UserMethods & Document

type UserModel = Model<UserDocument> & {
    findByCredentials(login: string, password: string): Promise<UserDocument>
}

const userSchema = new mongoose.Schema<UserAttributes>(
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
  { timestamps: true }
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
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.statics.findByCredentials = async (login, password) => {
  console.log(
    "🚀 ~ file: user.js:69 ~ userSchema.statics.findByCredentials= ~ password:",
    password
  );
  console.log(
    "🚀 ~ file: user.js:69 ~ userSchema.statics.findByCredentials= ~ login:",
    login
  );
  const user = await User.findOne({ login });

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

module.exports = User;
