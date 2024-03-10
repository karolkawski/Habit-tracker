import mongoose, { Document, Model, Schema } from "mongoose"

type EntryAttributes = {
    time: Date;
    habit_id: mongoose.Types.ObjectId;
    amount: number;
    count_mode: boolean;
  }
  
  export type EntryDocument = EntryAttributes & Document
  
  type EntryModel = Model<EntryDocument> & {
    getEntriesForHabit(habitId: mongoose.Types.ObjectId): Promise<EntryDocument[]>;
  };
  
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
  { timestamps: true }
);

entriesSchema.statics.getEntriesForHabit = function (
    habitId: mongoose.Types.ObjectId
  ): Promise<EntryDocument[]> {
    return this.find({ habit_id: habitId }).exec();
  };
  
  const Entry = mongoose.model<EntryDocument, EntryModel>("Entry", entriesSchema);
  

export default Entry;
