const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Authentication routes (no auth middleware)
router.get("/auth", appointmentController.authenticate);
router.get("/oauth2callback", appointmentController.handleOAuth2Callback);

router.use(authMiddleware.checkAuth);

// Protected routes (require authentication)
router.get("/available-slots", appointmentController.getAvailableSlots);
router.post("/book-slot", appointmentController.bookSlot);

module.exports = router;
