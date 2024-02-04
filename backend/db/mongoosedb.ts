const mongoose = require("mongoose");
const mongodb = require("mongodb");

//CONNECTION
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/habit_tracker_290423", {
	useNewUrlParser: true,
});
