const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const globalError = require("././controller/errorController.js");
const helmet = require("helmet");
const userRouter = require("././routes/userRoutes");
const path = require('path')

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
// app.use("/", express.static("uploads"));

app.use('/', express.static(path.join(__dirname, "/uploads")))



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.get("/", function (req, res) {
  res.send("hello");
});

app.use("/api/v1/user", userRouter);


// Error handling;
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
  // next(error);
});
app.use(globalError);

module.exports = app;
