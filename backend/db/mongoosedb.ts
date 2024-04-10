import mongoose, { ConnectOptions } from "mongoose";

const options: ConnectOptions = {};

// mongoose.connect("mongodb://localhost:27017/habitTrackerDB", options);
mongoose.connect("mongodb://mongo:27017/habitTrackerDB", options);
