const express = require("express");
const appointmentRoutes = require("./routes/appointmentRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

app.use(express.json());

app.get("/api/appointments/oauth2callback", appointmentRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/auth", authRoutes);

module.exports = app;
