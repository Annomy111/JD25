import React from 'react';
import SocialMediaSharing from './SocialMediaSharing';

const CampaignEvent = ({ event }) => {
  const shareUrl = `https://wahlkampf.de/events/${event.id}`;
  
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">{event.title}</h2>
      
      <div className="space-y-2">
        <p className="text-gray-700">{event.description}</p>
        <div className="text-sm text-gray-600">
          <p>📅 {new Date(event.date).toLocaleDateString('de-DE')}</p>
          <p>📍 {event.location}</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-2">Diese Veranstaltung teilen:</h3>
        <SocialMediaSharing
          url={shareUrl}
          title={`Komm zur Wahlkampfveranstaltung: ${event.title}`}
          description={`Ich nehme an dieser Veranstaltung teil: ${event.title}. ${event.description}`}
        />
      </div>
      
      <div className="mt-4 flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Teilnehmen
        </button>
      </div>
    </div>
  );
};

export default CampaignEvent;