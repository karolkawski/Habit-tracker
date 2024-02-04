import express, {Router, Request, Response} from "express";
import Entry from "../models/entry";
import Habit from "../models/habit";
const router: Router = express.Router();
import auth from "../middleware/auth";
import {EntryDocument} from '../models/entry'

/**
 * List all entries
 */
router.get("/api/entries", auth, (req: Request, res: Response) => {
  Entry.find({})
    .then((entries: EntryDocument[]) => {
      res.status(201).send(entries);
    })
    .catch((e: any) => {
      res.status(500).send(e);
    });
});

/**
 *  Get entrie by id
 */
router.get("/api/entries/:id", auth,  (req: Request, res: Response) => {
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
router.post("/api/entries/add", auth, async  (req: Request, res: Response) => {
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

  if (habit && habit.count_mode) {
    if (!entrie) {
        res.status(400).send("Missing entrie");
        return;
    }
    const currAmount = Number.parseInt(entrie.amount.toString());
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
router.get("/api/entriesByDate", auth,  (req: Request, res: Response) => {
  const { start, end } = req.query;
  if (start === undefined || end === undefined) {
    return res.status(400).send("Start and end dates are required");
  }
  const startDate: Date = new Date(start as string);
  const endDate: Date  = new Date(end as string);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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
router.get("/api/entriesByHabitAndDate", auth,  (req: Request, res: Response) => {
  const { start, end, habit_id } = req.query;
  if (start === undefined || end === undefined) {
    return res.status(400).send("Start and end dates are required");
  }
  const startDate: Date = new Date(start as string);
  const endDate: Date  = new Date(end as string);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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
router.delete("/api/entries/:id", auth, (req: Request, res: Response) => {
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
