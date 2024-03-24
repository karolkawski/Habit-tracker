import Settings from "../models/settings";
import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import auth from "../middleware/auth";

router.get("/api/settings", auth, (req: Request, res: Response) => {
  Settings.find({})
    .then(settings => {
      res.status(201).send(settings);
    })
    .catch(e => {
      res.status(500).send(e);
    });
});

router.post("/api/settings/add", auth, async (req: Request, res: Response) => {
  const { name, value } = req.query;

  const existedSetting = await Settings.findOne({ name: name });
  if (existedSetting) {
    const updatedSetting = await Settings.findByIdAndUpdate(
      existedSetting._id,
      { ...req.body, value: value },
      { new: true, runValidators: false },
    );
    if (updatedSetting) {
      return res.status(201).send(existedSetting);
    }
    return res.status(301).send("Setting not updated");
  } else {
    const newSettings = new Settings(req.body);

    newSettings
      .save()
      .then(settingReq => {
        res.status(201).send(settingReq);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
});

router.delete("/api/settings/delete", auth, async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const existedSetting = await Settings.findOne({ name: name });
    if (existedSetting) {
      const deletedSetting = await Settings.findByIdAndDelete(existedSetting._id);

      if (deletedSetting) {
        res.status(203).send(deletedSetting);
      } else {
        res.status(204).send("Element not deleted");
      }
    } else {
      res.status(303).send("This setting does not exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/api/settings/update", auth, async (req: Request, res: Response) => {
  try {
    const { name, value } = req.body;
    const existedSetting = await Settings.findOne({ name: name });
    if (existedSetting) {
      const updatedSetting = await Settings.findByIdAndUpdate(
        existedSetting._id,
        { value: value },
        { new: true, runValidators: false },
      );
      if (updatedSetting) {
        return res.status(201).send(updatedSetting);
      } else {
        return res.status(204).send("Element not updated");
      }
    }
    return res.status(303).send("This setting does not exist");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
