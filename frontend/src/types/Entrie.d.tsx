import { HabitType } from './Habit.d';

export interface EntryType {
  _id: string;
  time: Date;
  habit_id: string;
  amount: number;
  count_mode: boolean;
}

export interface EntryRowProps {
  habit: HabitType;
  selectedDate: Date;
  entry?: EntryType;
  handleAddEntry: (entry: EntryType) => void;
  handleRemoveEntry: (entry: EntryType) => void;
}
