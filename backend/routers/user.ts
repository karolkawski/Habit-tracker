import express, {Router, Request, Response} from "express";
const router: Router = express.Router();
import User from "../models/user";
import auth from "../middleware/auth";

type AuthenticatedRequest = Request & {
    user?: {
      tokens: string[];
      save: () => Promise<void>;
    };
  }

router.post("/api/user/add", async (req: Request, res: Response) => {
  const user = await new User(req.body);

  user
    .save()
    .then(async (user: { generateAuthToken: () => any; getPublicData: () => any; }) => {
      const token = await user.generateAuthToken();
      res.status(200).send({ user: user.getPublicData(), token });
    })
    .catch(() => {
      res.status(400).send("Cancel request");
    });
});

router.post("/api/user/login", async (req: Request, res: Response) => {
  const user = await User.findByCredentials(req.body.login, req.body.password);
  if (!user) {
    res.status(400).send("Unable to login");
    return;
  }
  const token = await user.generateAuthToken();
  res.status(200).send({ user: user.getPublicData(), token });
});

router.get("/api/user/me", auth, (req: AuthenticatedRequest, res: Response) => {
  res.send(req.user);
});

router.get("/api/users", auth, async (req: Request, res: Response) => {
  const users = await User.find({});
  if (!users) {
    res.status(400).send("[]");
    return;
  }
  res.status(200).send(users);
});

router.post("/api/users/logout", auth, async (req: AuthenticatedRequest, res : Response) => {
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

router.delete("/api/user/delete", auth, (req: Request, res: Response) => {
  const { login, password } = req.body;
  User.findOneAndDelete({ login: login })
    .then((user: any) => {
      res.status(201).send(user);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

router.patch("/api/user/update/:id", auth, (req: Request, res: Response) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: false,
    runValidators: false,
  })
    .then((updatedUser: any) => {
      res.status(201).send(updatedUser);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

module.exports = router;
