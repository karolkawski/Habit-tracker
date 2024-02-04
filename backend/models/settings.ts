import mongoose, { Document, Model } from "mongoose"

type SettingsAttributes = {
    name: string;
    value: string;
}

type SettingsDocument = SettingsAttributes & Document

type SettingsModel = Model<SettingsDocument>

const settingsSchema = new mongoose.Schema<SettingsAttributes>(
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
  { timestamps: true }
);

const Settings = mongoose.model<SettingsDocument, SettingsModel>("Settings", settingsSchema);

module.exports = Settings;
