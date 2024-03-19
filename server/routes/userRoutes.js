const express = require("express");
const { upload } = require("./../utils/multer");
const userController = require("../controller/userController");

const router = express.Router();

router.post("/create-user", upload.single("file"), userController.createUser);

module.exports = router;
