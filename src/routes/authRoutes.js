const express = require("express");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.post("/password-reset", authController.requestPasswordReset);

module.exports = router;
