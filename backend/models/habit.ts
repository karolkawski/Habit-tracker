import mongoose, { Schema } from "mongoose";
import { HabitDocument, HabitModel } from "../types/models/Habit";

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
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
  { timestamps: true },
);

const Habit = mongoose.model<HabitDocument, HabitModel>("Habit", habitSchema);

export default Habit;
