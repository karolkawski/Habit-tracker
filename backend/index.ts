import express from "express";
import bodyParser from "body-parser";
import "./db/mongoosedb";

const habitRouter = require("./routers/habit");
const entieRouter = require("./routers/entry");
const statisticsRouter = require("./routers/statistics");
const settingsRouter = require("./routers/settings");
const usersRouter = require("./routers/user");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.json());

app.use(habitRouter);
app.use(entieRouter);
app.use(statisticsRouter);
app.use(settingsRouter);
app.use(usersRouter);

app.listen(port, () => {
    console.log("Server is up on port " + port);
  });
  