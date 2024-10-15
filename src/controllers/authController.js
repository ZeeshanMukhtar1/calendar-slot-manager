const simulateSendSMS = (phoneNumber, message) => {
  console.log(`Simulating SMS sent to ${phoneNumber}: ${message}`);
};

exports.requestPasswordReset = (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: "Phone number is required",
      message: "Please provide a phone number for password reset",
    });
  }

  // Generate a random reset code (in a real scenario, this would be more secure)
  const resetCode = Math.floor(100000 + Math.random() * 900000);

  // Simulate sending SMS
  simulateSendSMS(phoneNumber, `Your password reset code is: ${resetCode}`);

  res.json({
    success: true,
    message: "Password reset code sent successfully",
    data: {
      resetCode,
    },
  });
};
