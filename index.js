// index.js
const express = require('express'); // Import Express framework
const path = require('path'); // For serving HTML files
const { RtcTokenBuilder, RtcRole } = require('agora-access-token'); // Import Agora token builder
const app = express(); // Create an Express application
const port = 4000; // Define the port number

// Agora credentials
const APP_ID = '36a8711c6a374888bf3de28263b4b482'; // Replace with your actual Agora App ID
const APP_CERTIFICATE = 'ac4a4eae979d47f9a423710e01bd5b59'; // Replace with your Agora App Certificate

// Serve the HTML file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Serves the HTML file
});

// Generate Token Route
app.get('/generateToken', (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0; // Default to 0 for UID
  const role = RtcRole.PUBLISHER; // Set role as publisher for voice calls
  const expirationTimeInSeconds = 3600; // Set expiration time for 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Check if channelName is provided
  if (!channelName) {
    return res.status(400).json({ error: 'channelName is required' });
  }

  // Generate the Agora RTC token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  // Send the generated token as the response
  res.json({ token });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
