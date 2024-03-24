import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import User from "../models/user";

type AuthenticatedRequest = Request & {
  user?: { _id: string };
};

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token!, "somename") as { _id: string }; // xxx! not null/undefined
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

export default auth;
