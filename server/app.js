const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Error handling;
app.use(AppError);
module.exports = app;
