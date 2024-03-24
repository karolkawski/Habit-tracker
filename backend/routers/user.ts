import express, { Router, Request, Response } from "express";
import User from "../models/user";
import auth from "../middleware/auth";
import { UserDocument } from "../types/models/User";
import { AuthenticatedRequest } from "../types/Auth";
const router: Router = express.Router();

router.post("/api/user/add", async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user: user.getPublicData(), token });
  } catch (error) {
    res.status(400).send("Error while adding user");
  }
});

router.post("/api/user/login", async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await User.findByCredentials(login, password);
    if (!user) {
      res.status(400).send("Unable to login");
      return;
    }
    const token = await user.generateAuthToken();
    res.status(200).send({ user: user.getPublicData(), token });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/api/user/me", auth, (req: AuthenticatedRequest, res: Response) => {
  res.send(req.user);
});

router.get("/api/users", auth, async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(200).send("[]");
      return;
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/api/user/logout", auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      req.user.tokens = [];
      await req.user.save();
    }

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/api/user/delete", auth, async (req: Request, res: Response) => {
  const { login } = req.body;
  try {
    const user: UserDocument | null = await User.findOneAndDelete({ login: login });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/api/user/update/:id", auth, async (req: Request, res: Response) => {
  try {
    const user: UserDocument | null = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: false,
      runValidators: false,
    });

    res.status(201).send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
