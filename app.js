const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const concertsRoutes = require("./routes/concerts-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/concerts", concertsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

const mongoUrl =
  "mongodb+srv://ampadmin:sdf234mo@amp-mongo-g6cxj.mongodb.net/amp?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl)
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log("DB connection Error:" + err);
  });
