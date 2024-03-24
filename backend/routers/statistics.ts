import express, { Router, Request, Response } from "express";
import Habit from "../models/habit";
import Entry from "../models/entry";
import { HabitDocument } from "../types/models/Habit";
import { EntryDocument } from "../types/models/Entry";
import calculateTimeGap from "../utils/calculateTimeGap";
import dateRange from "../utils/dateRange";
import auth from "../middleware/auth";
import getLastThreeMonths from "../utils/getLastThreeMonths";
const router: Router = express.Router();

router.get("/api/statistics/entries", auth, async (req: Request, res: Response) => {
  const { habitID, year } = req.query;

  if (year === undefined) {
    res.status(400).send("Missing year");
    return;
  }

  const numericYear = parseInt(year as string, 10);

  const firstDayOfYear = new Date(Date.UTC(numericYear, 0, 1));
  const lastDayOfYear = new Date(Date.UTC(numericYear + 1, 0, 1));
  lastDayOfYear.setDate(lastDayOfYear.getDate() - 1);

  try {
    let entries: EntryDocument[];
    if (habitID === "ALL") {
      entries = await Entry.find({
        time: {
          $gte: firstDayOfYear,
          $lt: lastDayOfYear,
        },
      });
    } else {
      entries = await Entry.find({
        time: {
          $gte: firstDayOfYear,
          $lt: lastDayOfYear,
        },
        habit_id: habitID,
      });
    }
    const dataArray = dateRange(firstDayOfYear, lastDayOfYear);
    const dateMap = new Map<string, number>();

    entries.forEach((entry: EntryDocument) => {
      const { time, amount } = entry;
      const dateKey = time.toISOString().split("T")[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, 0);
      }
      dateMap.set(dateKey, dateMap.get(dateKey)! + amount);
    });

    dataArray.forEach((entry: { date: Date; value: number }) => {
      const dateKey = entry.date.toISOString().split("T")[0];
      if (dateMap.has(dateKey)) {
        entry.value = dateMap.get(dateKey)!;
      }
    });

    res.status(200).json(dataArray);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/api/statistics/habits", auth, async (req: Request, res: Response) => {
  const { time } = req.query;
  const currentTime = new Date();
  const startDate = calculateTimeGap(currentTime, time as string);
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
      }),
    );

    res.status(201).send(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/api/statistics/currentMonthhHabitEntries",
  auth,
  async (req: Request, res: Response) => {
    const currentTime = new Date();
    const months = await getLastThreeMonths(currentTime);
    const { habit_id } = req.query;

    if (!habit_id) {
      res.status(400).send("Missing habit");
      return;
    }
    try {
      const response = await Promise.all(
        months.map(async month => {
          const startOfMonth = new Date(Date.UTC(month.year, month.month - 1, 1));
          const endOfMonth = new Date(Date.UTC(month.year, month.month, 0));
          const entries = await Entry.find({
            time: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
            habit_id: habit_id,
          });
          const processedEntries = entries.map(entry => {
            const date = new Date(entry.time);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            return { date };
          });

          return { ...month, entries: processedEntries };
        }),
      );

      res.status(201).send(response);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },
);

router.get("/api/statistics/habitWeekdays", auth, async (req: Request, res: Response) => {
  const { habitID, time } = req.query;
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const response: { name: string; value: number }[] = [];
  const currentTime = new Date();
  const startDate = calculateTimeGap(currentTime, time as string);

  dayNames.map(day => {
    response.push({ name: day, value: 0 });
  });

  try {
    let entries: EntryDocument[];
    if (habitID === "ALL") {
      entries = await Entry.find({
        time: {
          $gte: startDate,
          $lt: currentTime,
        },
      });
    } else {
      entries = await Entry.find({
        time: {
          $gte: startDate,
          $lt: currentTime,
        },
        habit_id: habitID,
      });
    }

    entries.map((entry: EntryDocument) => {
      const { time } = entry;
      const dayIndex = new Date(time).getDay();
      response[dayIndex] = {
        name: response[dayIndex].name,
        value: response[dayIndex].value + 1,
      };
    });
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
