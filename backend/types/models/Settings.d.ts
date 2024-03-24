import { Document, Model } from "mongoose";

type SettingsAttributes = {
  name: string;
  value: string;
};

export type SettingsDocument = SettingsAttributes & Document;

export type SettingsModel = Model<SettingsDocument>;
