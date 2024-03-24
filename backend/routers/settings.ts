import Settings from "../models/settings";
import express, { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import { SettingsDocument } from "../types/models/Settings";
const router: Router = express.Router();

router.get("/api/settings", auth, async (req: Request, res: Response) => {
  try {
    const settings: SettingsDocument[] = await Settings.find({});
    res.status(200).send(settings);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/api/settings/add", auth, async (req: Request, res: Response) => {
  const { name, value } = req.query;

  try {
    const existedSetting = await Settings.findOne({ name: name });
    if (existedSetting) {
      const updatedSetting = await Settings.findByIdAndUpdate(
        existedSetting._id,
        { ...req.body, value: value },
        { new: true, runValidators: false },
      );
      if (!updatedSetting) {
        return res.status(400).send("Setting not updated");
      }
      return res.status(200).send(existedSetting);
    } else {
      const newSettings = await new Settings(req.body);
      const newSettingsSaved = await newSettings.save();

      res.status(200).send(newSettingsSaved);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
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
