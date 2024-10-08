const express = require('express');
const path = require('path');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const app = express();
const port = 4000;

// Agora credentials
const APP_ID = '36a8711c6a374888bf3de28263b4b482'; // Replace with your Agora App ID
const APP_CERTIFICATE = 'ac4a4eae979d47f9a423710e01bd5b59'; // Replace with your Agora App Certificate

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for token generation
app.get('/api/generateToken', (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  if (!channelName) {
    return res.status(400).json({ error: 'channelName is required' });
  }

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({ token });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
