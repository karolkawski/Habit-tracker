const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/api/user/add", async (req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
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

router.post("/api/user/login", async (req: { body: { login: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  console.log("🚀 ~ file: user.js:21 ~ router.post ~ req:", req);
  const user = await User.findByCredentials(req.body.login, req.body.password);
  if (!user) {
    res.status(400).send("Unable to login");
    return;
  }
  const token = await user.generateAuthToken();
  console.log("🚀 ~ file: user.js:28 ~ router.post ~ token:", token);
  console.log(user);
  res.status(200).send({ user: user.getPublicData(), token });
});

router.get("/api/user/me", auth, (req: { user: any; }, res: { send: (arg0: any) => void; }) => {
  res.send(req.user);
});

router.get("/api/users", auth, async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  const users = await User.find({});
  if (!users) {
    res.status(400).send("[]");
    return;
  }
  res.status(200).send(users);
});

router.post("/api/users/logout", auth, async (req: { user: { tokens: never[]; save: () => any; }; }, res: { send: () => void; status: (arg0: number) => { (): any; new(): any; send: { (): void; new(): any; }; }; }) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/api/user/delete", auth, (req: { body: { login: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  const { login, password } = req.body;
  User.findOneAndDelete({ login: login })
    .then((user: any) => {
      res.status(201).send(user);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

router.patch("/api/user/update/:id", auth, (req: { params: { id: any; }; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
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
