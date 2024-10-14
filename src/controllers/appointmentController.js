const googleCalendarService = require("../services/googleCalendarService");

exports.getAvailableSlots = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      success: false,
      error: "Missing start or end date",
      message: "Please provide both start and end dates",
    });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const availableSlots = await googleCalendarService.getAvailableSlots(
      startDate,
      endDate
    );
    res.json({
      success: true,
      data: availableSlots,
      message: "Available slots retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(400).json({
      success: false,
      error: "Failed to fetch available slots",
      message: error.message,
    });
  }
};

exports.bookSlot = async (req, res) => {
  const { start, end, summary } = req.body;
  try {
    const bookedSlot = await googleCalendarService.bookSlot(
      start,
      end,
      summary
    );
    res.json({
      success: true,
      data: bookedSlot,
      message: "Slot booked successfully",
    });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({
      success: false,
      error: "Failed to book slot",
      message: error.message,
    });
  }
};

exports.authenticate = (req, res) => {
  const authUrl = googleCalendarService.getAuthUrl();
  res.redirect(authUrl);
};

exports.handleOAuth2Callback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    console.error("Authorization code is missing");
    return res.status(400).json({
      success: false,
      error: "Authorization code is missing",
      message: "Please start the authentication process from the beginning.",
    });
  }
  try {
    await googleCalendarService.setTokens(code);
    res.json({
      success: true,
      message: "Authentication successful! You can now use the calendar API.",
    });
  } catch (error) {
    console.error("Error authenticating:", error);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
      message: error.message,
    });
  }
};
