import { Document, Model } from "mongoose";

type HabitAttributes = {
  name: string;
  type: string;
  color: string;
  icon: string;
  count_mode: boolean;
  amount: number;
  frequency: {
    days: {
      Mon: boolean;
      Tue: boolean;
      Wed: boolean;
      Thu: boolean;
      Fri: boolean;
      Sat: boolean;
      Sun: boolean;
    };
    repeat: string;
  };
};

export type HabitModel = Model<HabitDocument>;

export type HabitDocument = HabitAttributes & Document;
