const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const JD21_CALENDAR_ID = 'nvf3q8gvcrtm7ed3kfupcc0j78@group.calendar.google.com';
const API_KEY = process.env.GOOGLE_API_KEY; // Wir nutzen einen API Key für öffentliche Kalender

// Google Calendar API Konfiguration
const calendar = google.calendar({ 
  version: 'v3',
  auth: API_KEY 
});

// Hole alle Events vom JD21 Kalender
router.get('/events', async (req, res) => {
  try {
    const result = await calendar.events.list({
      calendarId: JD21_CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(result.data.items);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ 
      message: 'Failed to fetch calendar events', 
      error: error.message 
    });
  }
});

module.exports = router;