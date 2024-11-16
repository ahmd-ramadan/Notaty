const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const httpStatusText = require("./utils/httpStatusText");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(compression());
require("dotenv").config();

const mongodb_url = process.env.MONGODB_URL;
mongoose.connect(mongodb_url).then(() => {
  console.log("Database running now ^_^ ...");
});

const notesRouter = require("./routes/notes-routes");
app.use("/notes", notesRouter);

const usersRouter = require("./routes/users-routes");
app.use("/auth", usersRouter);

app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This resourse is not available",
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    code: error.statusCode || 500,
    message: error.message || "Error",
    data: null,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening On Port ${PORT} ...`);
});
