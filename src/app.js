const express = require("express");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

app.use(express.json());

app.get("/api/appointments/oauth2callback", appointmentRoutes);

app.use("/api/appointments", appointmentRoutes);

module.exports = app;
