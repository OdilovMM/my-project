const express = require("express");
const userController = require("../controller/userController");
const { upload } = require("./../utils/multer");

const router = express.Router();

router.post("/create-user", upload.single("file"),  userController.createUser);
router.post("/activation", userController.activateUser);

module.exports = router;
