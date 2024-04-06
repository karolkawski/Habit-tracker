import mongoose, { Schema } from "mongoose";
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
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model<SettingsDocument, SettingsModel>("Settings", settingsSchema);

export default Settings;
