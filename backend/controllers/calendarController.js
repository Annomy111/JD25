const { google } = require('googleapis');
const moment = require('moment-timezone');

// Initialize Google Calendar client
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

const calendarController = {
  // Get upcoming events
  getEvents: async (req, res) => {
    try {
      const response = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: req.query.limit || 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        location: event.location,
        attendees: event.attendees || [],
        created: event.created,
        updated: event.updated,
        status: event.status
      }));
      
      res.json(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      res.status(500).json({ message: 'Error fetching calendar events' });
    }
  },

  // Create new event
  createEvent: async (req, res) => {
    try {
      const { title, description, start, end, location, attendees } = req.body;

      const event = {
        summary: title,
        description,
        start: {
          dateTime: moment(start).format(),
          timeZone: 'Europe/Berlin',
        },
        end: {
          dateTime: moment(end).format(),
          timeZone: 'Europe/Berlin',
        },
        location,
        attendees: attendees?.map(email => ({ email })),
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
        sendUpdates: 'all',
      });

      res.json(response.data);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      res.status(500).json({ message: 'Error creating calendar event' });
    }
  },

  // Update event
  updateEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const { title, description, start, end, location, attendees } = req.body;

      const event = {
        summary: title,
        description,
        start: {
          dateTime: moment(start).format(),
          timeZone: 'Europe/Berlin',
        },
        end: {
          dateTime: moment(end).format(),
          timeZone: 'Europe/Berlin',
        },
        location,
        attendees: attendees?.map(email => ({ email })),
      };

      const response = await calendar.events.update({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
        resource: event,
        sendUpdates: 'all',
      });

      res.json(response.data);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      res.status(500).json({ message: 'Error updating calendar event' });
    }
  },

  // Delete event
  deleteEvent: async (req, res) => {
    try {
      const { eventId } = req.params;

      await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
        sendUpdates: 'all',
      });

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      res.status(500).json({ message: 'Error deleting calendar event' });
    }
  },

  // Get event by ID
  getEvent: async (req, res) => {
    try {
      const { eventId } = req.params;

      const response = await calendar.events.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
      });

      res.json(response.data);
    } catch (error) {
      console.error('Error fetching calendar event:', error);
      res.status(500).json({ message: 'Error fetching calendar event' });
    }
  },

  // List attendees for an event
  getEventAttendees: async (req, res) => {
    try {
      const { eventId } = req.params;

      const response = await calendar.events.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
      });

      const attendees = response.data.attendees || [];
      res.json(attendees);
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      res.status(500).json({ message: 'Error fetching event attendees' });
    }
  }
};

module.exports = calendarController;