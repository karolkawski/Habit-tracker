import express, {Router, Request, Response} from "express";
import Habit, { HabitDocument } from "../models/habit";
const router: Router = express.Router();
import Entry from "../models/entry";
import calculateTimeGap from "../utils/calculateTimeGap";
import dateRange from "../utils/dateRange";
import getDaysArray from "../utils/getDaysArray";
import auth from "../middleware/auth";
import { HabitType } from "../types/Habit";

router.get("/api/statistics/entries", auth, (req: Request, res: Response) => {
  const { habitID, year } = req.query;

  if (year === undefined) {
    res.status(404).send("Missing year");
    return;
  }

  const numericYear = parseInt(year as string, 10);


  const firstDayOfYear = new Date(Date.UTC(numericYear, 0, 1));
  const lastDayOfYear = new Date(Date.UTC(numericYear + 1, 0, 1));
  lastDayOfYear.setDate(lastDayOfYear.getDate() - 1);

  if (habitID === "ALL") {
    Entry.find({
      time: {
        $gte: firstDayOfYear,
        $lt: lastDayOfYear,
      },
    })
      .then((entries: any[]) => {
        const dataArray = dateRange(firstDayOfYear, lastDayOfYear);
        const dateMap = new Map();

        entries.forEach((entry: { time: any; amount: any; }) => {
          const { time, amount } = entry;
          const dateKey = time.toISOString().split("T")[0];
          if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, 0);
          }
          dateMap.set(dateKey, dateMap.get(dateKey) + amount);
        });

        dataArray.forEach((entry: { date: { toISOString: () => string; }; value: any; }) => {
          const dateKey = entry.date.toISOString().split("T")[0];
          if (dateMap.has(dateKey)) {
            entry.value = dateMap.get(dateKey);
          }
        });

        res.status(201).send(dataArray);
      })
      .catch((e: any) => {
        res.status(400).send(e);
      });
  } else {
    Entry.find({
      time: {
        $gte: firstDayOfYear,
        $lt: lastDayOfYear,
      },
      habit_id: habitID,
    })
      .then((entries: any[]) => {
        const dataArray = getDaysArray(firstDayOfYear, lastDayOfYear);
        let data: { date: any; value: any; }[] = [];

        //preprocess response
        entries.map((entry: { time: any; amount: any; }) => {
          const { time, amount } = entry;
          data.push({ date: time, value: amount });
        });

        const secondArrayMap = new Map(
          data.map((item) => [
            `${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDay()}`,
            item.value,
          ])
        );

        // Override values in the first array with values from the second array
        const mergedArray = dataArray.map((item: { date: { getFullYear: () => any; getMonth: () => any; getDay: () => any; }; value: any; }) => ({
          date: item.date,
          value:
            secondArrayMap.get(
              `${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDay()}`
            ) || item.value,
        }));

        res.status(201).send(mergedArray);
      })
      .catch((e: any) => {
        res.status(400).send(e);
      });
  }
});

router.get("/api/statistics/habits", auth, async (req: Request, res: Response) => {
  const { time } = req.query;
  const currentTime = new Date();
  const startDate = calculateTimeGap(currentTime, time);
  try {
    const habits = await Habit.find({});
    const response = await Promise.all(
      habits.map(async (habit: HabitDocument) => {
        const entries = await Entry.find({
          time: {
            $gte: startDate,
            $lt: currentTime,
          },
          habit_id: habit.id,
        });
        const entriesAmount = entries.length;
        return { name: habit.name, value: entriesAmount };
      })
    );

    res.status(201).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/api/statistics/weekday", auth, (req: Request, res: Response) => {
  const { habitID, time } = req.query;
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const response: { name: string; value: number }[] = [];
  const currentTime = new Date();
  const startDate = calculateTimeGap(currentTime, time);

  dayNames.map((day) => {
    response.push({ name: day, value: 0 });
  });

  if (habitID === "ALL") {
    Entry.find({
      time: {
        $gte: startDate,
        $lt: currentTime,
      },
    })
      .then((entries: any[]) => {
        entries.map((entry: { time: any; }) => {
          const { time } = entry;
          const dayIndex = new Date(time).getDay();
          response[dayIndex] = {
            name: response[dayIndex].name,
            value: response[dayIndex].value + 1,
          };
        });
        res.status(201).send(response);
      })
      .catch((e: any) => {
        res.status(400).send(e);
      });
  } else {
    Entry.find({
      time: {
        $gte: startDate,
        $lt: currentTime,
      },
      habit_id: habitID,
    })
      .then((entries: any[]) => {
        entries.map((entry: { time: any; }) => {
          const { time } = entry;
          const dayIndex = new Date(time).getDay();
          response[dayIndex] = {
            name: response[dayIndex].name,
            value: response[dayIndex].value + 1,
          };
        });
        res.status(201).send(response);
      })
      .catch((e: any) => {
        res.status(400).send(e);
      });
  }
});

module.exports = router;
