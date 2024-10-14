const { oauth2Client, calendar } = require("../config/googleCalendar");
const fs = require("fs").promises;
const path = require("path");

const TOKEN_PATH = path.join(__dirname, "..", "token.json");

exports.getAuthUrl = () => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Generated Auth URL:", authUrl);
  return authUrl;
};

exports.setTokens = async (code) => {
  console.log("Attempting to set tokens with code:", code);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log("Tokens set and saved successfully");
  } catch (error) {
    console.error("Error setting tokens:", error);
    throw error;
  }
};

const loadSavedTokensIfExists = async () => {
  try {
    const token = await fs.readFile(TOKEN_PATH);
    oauth2Client.setCredentials(JSON.parse(token));
    console.log("Token loaded from file");
  } catch (err) {
    console.log("No token found, please authenticate first");
  }
};

exports.getAvailableSlots = async (start, end) => {
  await loadSavedTokensIfExists();
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    const busySlots = response.data.calendars.primary.busy;
    const availableSlots = [];

    let currentSlot = new Date(start);
    while (currentSlot < end) {
      const slotEnd = new Date(currentSlot.getTime() + 30 * 60000); // 30-minute slots
      const isBusy = busySlots.some(
        (busy) =>
          new Date(busy.start) < slotEnd && new Date(busy.end) > currentSlot
      );

      if (!isBusy) {
        availableSlots.push({
          start: currentSlot.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      currentSlot = slotEnd;
    }

    return availableSlots;
  } catch (error) {
    console.error("Error fetching available slots", error);
    throw error;
  }
};

exports.bookSlot = async (start, end, summary) => {
  await loadSavedTokensIfExists();
  try {
    const event = {
      summary,
      start: { dateTime: start },
      end: { dateTime: end },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error("Error booking slot", error);
    throw error;
  }
};
