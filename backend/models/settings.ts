import mongoose from "mongoose";
import { SettingsDocument, SettingsModel } from "../types/models/Settings";

const settingsSchema = new mongoose.Schema<SettingsDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model<SettingsDocument, SettingsModel>("Settings", settingsSchema);

export default Settings;
