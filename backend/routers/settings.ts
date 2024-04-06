import Settings from "../models/settings";
import express, { Router, Response } from "express";
import auth from "../middleware/auth";
import { SettingsDocument } from "../types/models/Settings";
import { AuthenticatedRequest } from "../types/Auth";
const router: Router = express.Router();

/**
 * Get settings list
 */
router.get("/api/settings", auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user ? req.user._id : undefined;
    const settings: SettingsDocument[] = await Settings.find({ user_id });
    res.status(200).send(settings);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Add or override setting if exist
 */
router.post("/api/settings/add", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, value } = req.query;

  try {
    const user_id = req.user ? req.user._id : undefined;
    const existedSetting = await Settings.findOne({ name, user_id });
    if (existedSetting) {
      const updatedSetting = await Settings.findByIdAndUpdate(
        existedSetting._id,
        { ...req.body, value: value },
        { new: true, runValidators: false },
      );
      if (!updatedSetting) {
        return res.status(304).send("Setting not updated");
      }
      return res.status(200).send(existedSetting);
    } else {
      const newSettings = await new Settings({ ...req.body, user_id });
      const newSettingsSaved = await newSettings.save();

      res.status(200).send(newSettingsSaved);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Delete setting by name
 */
router.delete("/api/settings/delete", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;

  try {
    const user_id = req.user ? req.user._id : undefined;

    const existedSetting = await Settings.findOne({ name, user_id });
    if (existedSetting) {
      const deletedSetting = await Settings.findByIdAndDelete(existedSetting._id);

      if (deletedSetting) {
        res.status(200).send(deletedSetting);
      } else {
        res.status(304).send("Element not deleted");
      }
    } else {
      res.status(404).send("This setting does not exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/api/settings/update", auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, value } = req.body;
    const user_id = req.user ? req.user._id : undefined;

    const existedSetting = await Settings.findOne({ name, user_id });
    if (existedSetting) {
      const updatedSetting = await Settings.findByIdAndUpdate(
        existedSetting._id,
        { value: value },
        { new: true, runValidators: false },
      );
      if (updatedSetting) {
        return res.status(200).send(updatedSetting);
      } else {
        return res.status(304).send("Element not updated");
      }
    }
    return res.status(404).send("This setting does not exist");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
