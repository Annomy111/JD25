const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const calendar = require('../config/googleCalendar');

// Alle Events abrufen
router.get('/', auth, async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Events' });
  }
});

// Event erstellen
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, start, end, location } = req.body;

    const event = {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: end,
        timeZone: 'Europe/Berlin',
      },
      location,
      colorId: '1', // Blau für Kampagnen-Events
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Fehler beim Erstellen des Events' });
  }
});

// Event aktualisieren
router.put('/:eventId', auth, async (req, res) => {
  try {
    const { title, description, start, end, location } = req.body;

    const event = {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: end,
        timeZone: 'Europe/Berlin',
      },
      location,
    };

    const response = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: req.params.eventId,
      resource: event,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Events' });
  }
});

// Event löschen
router.delete('/:eventId', auth, async (req, res) => {
  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: req.params.eventId,
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Fehler beim Löschen des Events' });
  }
});

// Für ein Event registrieren
router.post('/:eventId/register', auth, async (req, res) => {
  try {
    const event = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: req.params.eventId,
    });

    const updatedEvent = {
      ...event.data,
      attendees: [...(event.data.attendees || []), { email: req.user.email }],
    };

    const response = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: req.params.eventId,
      resource: updatedEvent,
      sendUpdates: 'all',
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Fehler bei der Registrierung für das Event' });
  }
});

module.exports = router;