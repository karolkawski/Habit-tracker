import mongoose, { Schema } from "mongoose";
import { EntryDocument, EntryModel } from "../types/models/Entry";

const entriesSchema = new mongoose.Schema<EntryDocument>(
  {
    time: {
      type: Date,
      required: true,
    },
    habit_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Habit",
    },
    amount: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("Amount must be a positive number");
        }
      },
    },
    count_mode: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

entriesSchema.statics.getEntriesForHabit = async function ({
  habit_id,
}: {
  habit_id: mongoose.Types.ObjectId;
}): Promise<EntryDocument[]> {
  return await this.find({ habit_id }).exec();
};

const Entry = mongoose.model<EntryDocument, EntryModel>("Entry", entriesSchema);

export default Entry;
