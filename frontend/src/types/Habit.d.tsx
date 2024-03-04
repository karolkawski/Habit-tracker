export interface HabitType {
  _id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  amount: number;
  count_mode: boolean;
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
}
