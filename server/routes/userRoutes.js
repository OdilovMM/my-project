const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const { upload } = require("./../utils/multer");

const router = express.Router();

router.post("/create-user", upload.single("file"), authController.createUser);
router.post("/activation", authController.activateUser);
router.post("/login-user", authController.loginUser);
router.get("/getuser", authController.isLoggedIn, userController.getUser);
module.exports = router;
