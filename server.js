const app = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 3000;

// Testing endpoint to check if server is running
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is working fine😉",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Environment variables loaded:", {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  });
});
