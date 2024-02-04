const mongoose = require("mongoose");
const mongodb = require("mongodb");
const Habit = require("../models/habit");
const Entry = require("../models/entry");
const Settings = require("../models/settings");

//CONNECTION
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/habit_tracker_290423", {
  useNewUrlParser: true,
});

const randomZeroOrOne = Math.floor(Math.random() * 2);

const seedHabits = [
  {
    name: "Habbit01",
    type: "other",
    color: "red",
    icon: "plane",
    count_mode: false,
    amount: 0,
    frequency: {
      days: {
        Mon: true,
        Tue: false,
        Wed: true,
        Thu: false,
        Fri: true,
        Sat: false,
        Sun: true,
      },
      repeat: "week",
    },
  },
  {
    name: "Habbit02",
    type: "other",
    color: "blue",
    icon: "pencil",
    count_mode: false,
    amount: 0,
    frequency: {
      days: {
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: false,
        Fri: true,
        Sat: false,
        Sun: true,
      },
      repeat: "week",
    },
  },
];

const seedEntries = (habitIds) => {
  return [
    {
      time: "2023-03-01",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-02",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-03",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-04",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-05",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-06",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-07",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-08",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-09",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-10",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },

    {
      time: "2023-03-11",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-12",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-13",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-14",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-15",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-16",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-17",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-18",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-19",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-20",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-21",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-22",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-23",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-24",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-25",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-26",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-27",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-28",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-29",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-30",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
    {
      time: "2023-03-31",
      habit_id: habitIds[randomZeroOrOne],
      amount: 1,
      count_mode: false,
    },
  ];
};

const seedSettings = [
  {
    name: "darkMode",
    value: "false",
  },
];

const seedDb = async () => {
  await Habit.deleteMany({});
  await Habit.insertMany(seedHabits);
  await Settings.deleteMany({});
  await Settings.insertMany(seedSettings);

  const habitIds = await Habit.find({}, "_id");
  const ids = habitIds.map((habit) => habit._id);
  await Entry.deleteMany({});
  await Entry.insertMany(seedEntries(ids)).then((entries) => {});
};

seedDb().then(() => {
  mongoose.connection.close();
});
