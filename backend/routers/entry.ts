import express, { Router, Request, Response } from "express";
import Entry from "../models/entry";
import Habit from "../models/habit";
import auth from "../middleware/auth";
import { EntryDocument } from "../types/models/Entry";
import { EntryType } from "../types/Entry";

const router: Router = express.Router();

/**
 * List all entries
 */
router.get("/api/entries", auth, async (req: Request, res: Response) => {
  try {
    const entries: EntryDocument[] = await Entry.find({});
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 *  Get entrie by id
 */
router.get("/api/entries/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const entry: EntryType | null = await Entry.findById(id);

    if (!entry) {
      res.status(404).send("Entry not found");
    }

    res.status(201).send(entry);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error occurred:", error.message);
    }
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Add new entrie
 */
router.post("/api/entries/add", auth, async (req: Request, res: Response) => {
  const { habit_id } = req.body;
  const habit = await Habit.findById(habit_id);
  if (!habit) res.status(404).send("Missing habit");

  const entry = await Entry.findOne({
    time: {
      $gte: new Date().setUTCHours(0, 0, 0, 0),
      $lt: new Date().setUTCHours(23, 59, 59, 999),
    },
    habit_id,
  });

  //entrie not exist today
  if (!entry) {
    const newEntry = new Entry(req.body);

    try {
      const savedEntry = await newEntry.save();

      res.status(200).send(savedEntry);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }

    return;
  }

  if (habit && habit.count_mode) {
    if (!entry) {
      return res.status(400).send("Missing entry");
    }
    const currAmount = Number.parseInt(entry.amount.toString());
    if (currAmount + 1 > habit.amount) {
      return res.status(400).send("Max amount of entrie");
    }

    entry.amount = currAmount + 1;

    try {
      const updatedEntry = await Entry.findOneAndUpdate({ _id: entry._id }, entry, {
        new: true,
        runValidators: false,
      });

      res.status(200).send(updatedEntry);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).send(entry);
});

/**
 * Get Entries by date
 */
router.get("/api/entriesByDate", auth, async (req: Request, res: Response) => {
  const { start, end } = req.query;
  if (start === undefined || end === undefined) {
    return res.status(400).send("Start and end dates are required");
  }
  const startDate: Date = new Date(start as string);
  const endDate: Date = new Date(end as string);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).send("Invalid date range");
  }

  try {
    const entries: EntryDocument[] = await Entry.find({
      time: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    res.status(201).send(entries);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Get Entries by date and habit_id
 */
router.get("/api/entriesByHabitAndDate", auth, async (req: Request, res: Response) => {
  const { start, end, habit_id } = req.query;
  if (start === undefined || end === undefined) {
    return res.status(400).send("Start and end dates are required");
  }
  const startDate: Date = new Date(start as string);
  const endDate: Date = new Date(end as string);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).send("Invalid date range");
  }

  try {
    const entries: EntryDocument[] = await Entry.find({
      time: {
        $gte: startDate,
        $lt: endDate,
      },
      habit_id,
    });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Delete entrie
 */
router.delete("/api/entries/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const entry: EntryDocument | null = await Entry.findOneAndDelete({ _id: id });
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
