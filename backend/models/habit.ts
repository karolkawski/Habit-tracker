import mongoose, { Document, Model } from "mongoose"

type HabitAttributes = {
    name: string;
    type: string;
    color: string;
    icon: string;
    count_mode: boolean;
    amount: number;
    frequency: {days: {Mon: boolean, Tue: boolean, Wed: boolean, Thu: boolean, Fri: boolean, Sat: boolean, Sun: boolean}, repeat: string}
}

export type HabitDocument = HabitAttributes & Document

type HabitModel = Model<HabitDocument>


const habitSchema = new mongoose.Schema<HabitDocument>(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    color: {
      type: String,
    },
    icon: {
      type: String,
    },
    count_mode: {
      type: Boolean,
    },
    amount: {
      type: Number,
      validate(value: number) {
        if (value < 0) {
          throw new Error("Amount must be a positive number");
        }
      },
    },
    frequency: {
      days: {
        Mon: { type: Boolean },
        Tue: { type: Boolean },
        Wed: { type: Boolean },
        Thu: { type: Boolean },
        Fri: { type: Boolean },
        Sat: { type: Boolean }, 
        Sun: { type: Boolean },
      },
      repeat: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Habit = mongoose.model<HabitDocument, HabitModel>("Habit", habitSchema);

export default Habit;
