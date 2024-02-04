const express = require("express");
const Entry = require("../models/entry");
const Habit = require("../models/habit");
const router = new express.Router();
const auth = require("../middleware/auth");

/**
 * List all entries
 */
router.get("/api/entries", auth, (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: EntryType[]): void; new(): any; }; }; }) => {
  Entry.find({})
    .then((entries: EntryType[]) => {
      res.status(201).send(entries);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

/**
 *  Get entrie by id
 */
router.get("/api/entries/:id", auth, (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  const { id } = req.params;
  Entry.findById(id)
    .then((entry: any) => {
      if (!entry) {
        return res.status(404).send(entry);
      }
      res.status(201).send(entry);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

/**
 * Add new entrie
 */
router.post("/api/entries/add", auth, async (req: { body: { habit_id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  const { habit_id } = req.body;
  const habit = await Habit.findById(habit_id);
  if (!habit) res.status(404).send("Missing habit");

  const entrie = await Entry.findOne({
    time: {
      $gte: new Date().setUTCHours(0, 0, 0, 0),
      $lt: new Date().setUTCHours(23, 59, 59, 999),
    },
    habit_id,
  });

  //entrie not exist today
  if (!entrie) {
    const newEntrie = new Entry(req.body);

    newEntrie
      .save()
      .then((entrieReq: any) => {
        res.status(201).send(entrieReq);
      })
      .catch((e: any) => {
        res.status(400).send(e);
      });
    return;
  }

  if (habit.count_mode) {
    const currAmount = Number.parseInt(entrie.amount);
    if (currAmount + 1 > habit.amount) {
      res.status(400).send("Max amount of entrie");
      return;
    }

    entrie.amount = currAmount + 1;

    Entry.findOneAndUpdate(
      {
        id: entrie.id,
      },
      entrie,
      { new: true, runValidators: false }
    )
      .then((test: any) => {
        res.status(201).send(test);
      })
      .catch((e: any) => {
        res.status(400).send(e);
      });

    return;
  }

  res.status(201).send(entrie);
  return;
});

/**
 * Get Entries by date
 */
router.get("/api/entriesByDate", auth, (req: { query: { start: any; end: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  const { start, end } = req.query;
  const startDate: Date = new Date(start);
  const endDate: Date  = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).send("Invalid date range");
  }

  Entry.find({
    time: {
      $gte: startDate,
      $lt: endDate,
    },
  })
    .then((entry: any) => {
      res.status(201).send(entry);
    })
    .catch((e: any) => {
      res.status(400).send(e);
    });
});

/**
 * Get Entries by date and habit_id
 */
router.get("/api/entriesByHabitAndDate", auth, (req: { query: { start: any; end: any; habit_id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  const { start, end, habit_id } = req.query;
  const startDate: Date = new Date(start);
  const endDate: Date = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).send("Invalid date range");
  }

  Entry.find({
    time: {
      $gte: startDate,
      $lt: endDate,
    },
    habit_id,
  })
    .then((entry: any) => {
      res.status(201).send(entry);
    })
    .catch((e: any) => {
      res.status(400).send(e);
    });
});

/**
 * Delete entrie
 */
router.delete("/api/entries/:id", auth, (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
  const { id } = req.params;
  Entry.findOneAndDelete({ _id: id })
    .then((habit: any) => {
      res.status(201).send(habit);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

module.exports = router;
