import React from 'react';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const EventCard = ({ event }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-100">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Aktiv
        </span>
      </div>

      {/* Event Info */}
      <div className="flex items-start space-x-4">
        {/* Calendar Day */}
        <div className="flex-shrink-0 w-14 text-center">
          <div className="bg-blue-50 rounded-t-lg px-2 py-1">
            <span className="text-xs font-medium text-blue-700">DEZ</span>
          </div>
          <div className="border-b border-l border-r border-gray-200 rounded-b-lg px-2 py-1">
            <span className="text-2xl font-bold text-gray-900">15</span>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-medium text-gray-900 truncate">
            {event?.title || 'Event Titel'}
          </h4>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>14:00 - 16:00 Uhr</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>Wahlkreisbüro</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>5 Teilnehmer</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2 justify-end">
        <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Details
        </button>
        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Teilnehmen
        </button>
      </div>
    </div>
  );
};

export default EventCard;