const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

// Get public calendar events
router.get('/events', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
      fields: 'items(id,summary,description,start,end,location)'
    });
    
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location
    }));

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Error fetching calendar events' });
  }
});

module.exports = router;