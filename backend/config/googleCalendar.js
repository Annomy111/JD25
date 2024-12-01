const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// In einer echten Anwendung würden wir die Tokens in der Datenbank speichern
// und pro Benutzer verwalten
let tokens = null;

const getAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

const setTokens = async (code) => {
  const { tokens: newTokens } = await oauth2Client.getToken(code);
  tokens = newTokens;
  oauth2Client.setCredentials(tokens);
  return tokens;
};

const getCalendar = () => {
  if (!tokens) {
    throw new Error('No tokens set. User needs to authenticate first.');
  }
  oauth2Client.setCredentials(tokens);
  return google.calendar({ version: 'v3', auth: oauth2Client });
};

module.exports = {
  oauth2Client,
  getAuthUrl,
  setTokens,
  getCalendar,
};