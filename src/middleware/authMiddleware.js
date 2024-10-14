const { oauth2Client } = require("../config/googleCalendar");

exports.checkAuth = (req, res, next) => {
  if (!oauth2Client.credentials) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};
