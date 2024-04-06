import express, { Router, Response } from "express";
import Habit from "../models/habit";
import Entry from "../models/entry";
import { EntryDocument } from "../types/models/Entry";
import { HabitDocument } from "../types/models/Habit";
import auth from "../middleware/auth";
import { AuthenticatedRequest, AuthenticatedRequestWithTimeQuery } from "../types/Auth";

const router: Router = express.Router();

/**
 * List all habits
 */
router.get("/api/habits", auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user ? req.user._id : undefined;
    const habits: HabitDocument[] = await Habit.find({ user_id });
    res.status(200).send(habits);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Get habit by id
 */
router.get("/api/habits/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const habit: HabitDocument | null = await Habit.findById(id);
    if (!habit) {
      res.status(404).send("Habit not found");
    }
    res.status(200).send(habit);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Add new habit
 */
router.post("/api/habits/add", auth, async (req: AuthenticatedRequest, res: Response) => {
  delete req.body._id;
  let cancelRequest = false;

  req.on("close", function (err: Error) {
    cancelRequest = true;
    return res.status(404).send(err);
  });

  try {
    const user_id = req.user ? req.user._id : undefined;
    const habit = await new Habit({ ...req.body, user_id });
    const savedHabit = await habit.save();
    res.status(201).send(savedHabit);
  } catch (error) {
    if (cancelRequest) {
      return res.status(404).send("Cancel request");
    }
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Update habit by id
 */
router.patch("/api/habits/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const habit: HabitDocument | null = await Habit.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(habit);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Get habits by date
 */
router.get(
  "/api/habitsByDate",
  auth,
  async (req: AuthenticatedRequestWithTimeQuery, res: Response) => {
    let { time } = req.query;
    if (time) {
      const parsedTime = new Date(time as string);
      if (!isNaN(parsedTime.getTime())) {
        time = parsedTime as unknown as string;
      } else {
        res.status(400).send("Invalid date format");
        return;
      }
    }

    const dayIndex = new Date(time!).getDay() - 1;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const currentDay = days[dayIndex];
    const user_id = req.user ? req.user._id : undefined;

    const query: any = {};
    query[`frequency.days.${currentDay}`] = true;
    query["user_id"] = user_id;
    const startOfDay = new Date(time!);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(time!);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const habits: HabitDocument[] = await Habit.find(query);

      if (!habits || habits.length === 0) {
        res.status(200).send([]);
        return;
      }
      const promises = habits.map(async (habit: HabitDocument) => {
        return await Entry.findOne({
          habit_id: habit._id,
          time: { $gte: startOfDay, $lte: endOfDay },
        })
          .populate("habit_id")
          .exec();
      });

      Promise.all(promises)
        .then((entries: (EntryDocument | null)[]) => {
          const habitEntries: { habit: HabitDocument; entry: EntryDocument | null }[] = habits.map(
            (habit: HabitDocument, index: number) => ({
              habit: habit,
              entry: entries[index],
            }),
          );
          res.status(200).send({ habitEntries });
        })
        .catch(() => {
          res.status(500).send("Internal Server Error");
        });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },
);

/**
 * Delete habit by id
 */
router.delete("/api/habits/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const habit: HabitDocument | null = await Habit.findByIdAndDelete(id);
    res.status(200).send(habit);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
