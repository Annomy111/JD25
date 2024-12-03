import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Events = () => {
  const { isAdmin } = useAuth();
  const calendarUrl = "https://calendar.google.com/calendar/embed?src=nvf3q8gvcrtm7ed3kfupcc0j78%40group.calendar.google.com&ctz=Europe%2FBerlin";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Termine</h1>
            <p className="mt-2 text-sm text-gray-700">
              Alle Kampagnen-Events und Aktivitäten im Überblick
            </p>
          </div>
          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kalender bearbeiten
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Calendar */}
      <div className="flex-1 bg-white rounded-lg shadow p-4">
        <iframe
          src={calendarUrl}
          style={{ border: 0 }}
          width="100%"
          height="800"
          frameBorder="0"
          scrolling="no"
          title="Google Calendar"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default Events;