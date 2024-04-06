import mongoose, { ConnectOptions } from "mongoose";

const options: ConnectOptions = {};

mongoose.connect("mongodb://localhost:27017/habitTrackerDB", options);
// mongoose.connect("mongodb://localhost:27017/habit_tracker_290423", options);
