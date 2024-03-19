const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../model/User");
const path = require("path");
const fs = require("fs");

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    const filename = req.file.filename;
    const filePath = `uploads/${filename}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        // res.status(500).json({ message: "Error, deleting file" });
      } else {
        // res.json({message: "File deleted"})
      }
    });
    return next(new AppError("User already exist with this email", 400));
  }

  const filename = req.file.filename;
  const fileUrl = path.join(filename);

  const user = {
    name: name,
    email: email,
    password: password,
    avatar: fileUrl,
  };
  const newUser = await User.create(user);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
