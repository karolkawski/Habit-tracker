import mongoose, { Document, Model } from "mongoose";

type SettingsAttributes = {
  name: string;
  value: string;
  user_id: mongoose.Types.ObjectId;
};

export type SettingsDocument = SettingsAttributes & Document;

export type SettingsModel = Model<SettingsDocument>;
