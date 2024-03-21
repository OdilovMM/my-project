const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../model/User");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/Email");
const sendToken = require("../utils/sendToken");

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   const cookieOptions = {
//     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     httpOnly: true,
//   };

//   res.cookie("token", token, cookieOptions);
//   user.password = undefined;
//   res.status(statusCode).json({
//     status: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };

// activation token creation
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `./../uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          return next(new AppError("Deleting file", 500));
        }
      });
      return next(new AppError("User already exist with this email", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const user = {
      userName,
      firstName,
      lastName,
      email,
      password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    console.log(activationToken);
    console.log(activationUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        message: `Welcome, ${user.firstName}! Your account has been successfully created. In order to stay alive in our platform, Please activate your account via clicking on the link: ${activationUrl}`,
      });
      res.status(201).json({
        success: "success",
        message: `Please check your email: ${user.email}!`,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  } catch (error) {
    console.log(error);
  }
});

// activate our user
exports.activateUser = catchAsync(async (req, res, next) => {
  try {
    const { activation_Token } = req.body;
    console.log(activation_Token);
    const newUser = jwt.verify(activation_Token, process.env.ACTIVATION_SECRET);

    console.log(newUser);

    if (!newUser) {
      return next(new AppError("Invalid token or token expired", 400));
    }

    const { userName, firstName, lastName, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new AppError("User already registered with this email", 400));
    }

    user = await User.create({
      userName,
      firstName,
      lastName,
      email,
      password,
      avatar,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new AppError("There is no account registered with this email", 400)
    );
  }

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendToken(user, 200, res);
});
