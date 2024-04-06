import { Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import User from "../models/user";
import { AuthenticatedRequest } from "../types/Auth";

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token!, "somename") as { _id: string };
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = {
      ...user.toObject(),
    };
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

export default auth;
