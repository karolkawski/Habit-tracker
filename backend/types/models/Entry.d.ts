import mongoose, { Document, Model } from "mongoose";

type EntryAttributes = {
  time: Date;
  habit_id: mongoose.Types.ObjectId;
  amount: number;
  count_mode: boolean;
};

export type EntryModel = Model<EntryDocument> & {
  getEntriesForHabit(): Promise<EntryDocument[]>;
};

export type EntryDocument = EntryAttributes & Document;
