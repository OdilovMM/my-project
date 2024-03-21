const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/User");

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  res.status(200).json({
    success: "success",
    data: {
      user,
    },
  });
});
