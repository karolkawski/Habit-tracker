const express = require("express");
const Habit = require("../models/habit");
const Entry = require("../models/entry");
const router = new express.Router();
const auth = require("../middleware/auth");

type Frequency = {
    frequency: {
        days: { [key: string]: boolean };
      };
  }

  type HabitType ={
    id: string;
    name: string;
    // Add other properties as needed
  }
  
  type EntryType = {
    id: string;
    habitId: string;
    timestamp: Date;
    amount: number;
    countMode: boolean;
    // Add other properties as needed
  }
/**
 * List all habits
 * GET /habits?completed (today)
 * GET /habits?limit=10&skip=20
 */
router.get("/api/habits", auth, (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  Habit.find({})
    .then((habits: any) => {
      res.status(201).send(habits);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

/**
 * Get habit by id
 */
router.get("/api/habits/:id", auth, (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  const { id } = req.params;
  Habit.findById(id)
    .then((habit: any) => {
      if (!habit) {
        return res.status(404).send(habit);
      }
      res.status(201).send(habit);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

/**
 * Add new habit
 */
router.post("/api/habits/add", auth, async (req: { body: { _id: any; }; on: (arg0: string, arg1: (err: any) => void) => void; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  delete req.body._id;
  let cancelRequest = false;

  req.on("close", function (err: any) {
    cancelRequest = true;
  });

  const habit = await new Habit(req.body);
  habit
    .save()
    .then(() => {
      res.status(201).send(habit);
    })
    .catch((err: any) => {
      if (cancelRequest) {
        return res.status(404).send("Cancel request");
      }
      res.status(404).send(err);
    });
});

/**
 * Update habit
 */
router.patch("/api/habits/:id", auth, (req: { params: { id: any; }; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((habit: any) => {
      res.status(201).send(habit);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

/**
 * Get today's habits
 */
router.get("/api/todayHabits", auth, (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { habits: any; }): void; new(): any; }; }; }) => {
  const currentTime = new Date();
  const dayIndex = currentTime.getDay();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = days[dayIndex];
  const query: Frequency = { frequency: { days: {} } };
  query.frequency.days[currentDay] = true;

  Habit.find(query)
    .then((habits: any) => {
      res.status(201).send({ habits });
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
});

/**
 * Get habits by date
 */
router.get("/api/habitsByDate", auth, (req: { query: { time: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: never[]): void; new(): any; }; }; }) => {
  let { time } = req.query;
  if (time instanceof Date && !isNaN(time.valueOf())) {
    time = new Date();
  }

  const dayIndex = new Date(time).getDay();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = days[dayIndex];
  const query: Frequency = { frequency: { days: {} } };
  query.frequency.days[currentDay] = true;

  const startOfDay = new Date(time);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(time);
  endOfDay.setHours(23, 59, 59, 999);

  Habit.find(query)
    .then((habits: any[]) => {
      console.log("🚀 ~ .then ~ habits:", habits);
      if (!habits || habits.length === 0) {
        res.status(200).send([]);
        return;
      }

      const promises = habits.map((habit: { _id: any; }) => {
        return Entry.findOne({
          habit_id: habit._id,
          time: { $gte: startOfDay, $lte: endOfDay },
        })
          .populate("habit_id")
          .exec();
      });

      Promise.all(promises)
        .then((entries: EntryType[]) => {
          const habitEntries: { habit: HabitType; entry: EntryType }[] = habits.map((habit: HabitType, index: number) => ({
            habit: habit,
            entry: entries[index],
          }));
          res.status(200).send({ habitEntries });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
});

/**
 * Delete habit
 */
router.delete("/api/habits/:id", auth, (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  Habit.findByIdAndDelete(req.params.id)
    .then((habit: any) => {
      res.status(201).send(habit);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

module.exports = router;

