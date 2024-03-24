import express, { Router, Request, Response } from "express";
import Habit from "../models/habit";
import Entry from "../models/entry";
import { EntryDocument } from "../types/models/Entry";
import { HabitDocument } from "../types/models/Habit";
import auth from "../middleware/auth";

const router: Router = express.Router();

/**
 * List all habits
 * GET /habits?completed (today)
 * GET /habits?limit=10&skip=20
 */
router.get("/api/habits", auth, (req: Request, res: Response) => {
  Habit.find({})
    .then((habits: HabitDocument[]) => {
      res.status(201).send(habits);
    })
    .catch((e: Error) => {
      res.status(500).send(e);
    });
});

/**
 * Get habit by id
 */
router.get("/api/habits/:id", auth, (req: Request, res: Response) => {
  const { id } = req.params;
  Habit.findById(id)
    .then((habit: HabitDocument | null) => {
      if (!habit) {
        return res.status(404).send(habit);
      }
      res.status(201).send(habit);
    })
    .catch((e: Error) => {
      res.status(500).send(e);
    });
});

/**
 * Add new habit
 */
router.post("/api/habits/add", auth, async (req: Request, res: Response) => {
  delete req.body._id;
  let cancelRequest = false;

  req.on("close", function (err: Error) {
    cancelRequest = true;
    return res.status(404).send(err);
  });

  const habit = await new Habit(req.body);
  habit
    .save()
    .then(() => {
      res.status(201).send(habit);
    })
    .catch((err: Error) => {
      if (cancelRequest) {
        return res.status(404).send("Cancel request");
      }
      res.status(404).send(err);
    });
});

/**
 * Update habit
 */
router.patch("/api/habits/:id", auth, (req: Request, res: Response) => {
  Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((habit: HabitDocument | null) => {
      res.status(201).send(habit);
    })
    .catch((e: Error) => {
      res.status(500).send(e);
    });
});

/**
 * Get today's habits
 */
router.get("/api/todayHabits", auth, (req: Request, res: Response) => {
  const currentTime = new Date();
  const dayIndex = currentTime.getDay();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = days[dayIndex];
  const query: any = { frequency: { days: days } };
  query.frequency.days[currentDay] = true;

  Habit.find(query)
    .then((habits: HabitDocument[]) => {
      res.status(201).send({ habits });
    })
    .catch((error: Error) => {
      res.status(500).send(error);
    });
});

/**
 * Get habits by date
 */
router.get("/api/habitsByDate", auth, (req: Request<{}, {}, { time?: string }>, res: Response) => {
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
  const query: any = {};
  query[`frequency.days.${currentDay}`] = true;
  const startOfDay = new Date(time!);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(time!);
  endOfDay.setHours(23, 59, 59, 999);

  Habit.find(query)
    .then((habits: HabitDocument[]) => {
      if (!habits || habits.length === 0) {
        res.status(200).send([]);
        return;
      }

      const promises = habits.map((habit: HabitDocument) => {
        return Entry.findOne({
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
        .catch(error => {
          res.status(500).send(error);
        });
    })
    .catch((error: Error) => {
      res.status(500).send(error);
    });
});

/**
 * Delete habit
 */
router.delete("/api/habits/:id", auth, (req: Request, res: Response) => {
  Habit.findByIdAndDelete(req.params.id)
    .then((habit: HabitDocument | null) => {
      res.status(201).send(habit);
    })
    .catch((e: Error) => {
      res.status(500).send(e);
    });
});

module.exports = router;
