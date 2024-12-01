import React from 'react';
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';

const DashboardHeader = ({ title, subtitle }) => {
  const quickActions = [
    { name: 'Event erstellen', href: '#' },
    { name: 'Freiwillige einladen', href: '#' },
    { name: 'Kampagne planen', href: '#' },
  ];

  return (
    <div className="lg:flex lg:items-center lg:justify-between mb-8">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          {title}
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4 space-x-3">
        {/* Notification Bell */}
        <span className="hidden sm:block">
          <button type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <BellIcon className="h-5 w-5 text-gray-400" />
          </button>
        </span>

        {/* Quick Actions Dropdown */}
        <div className="relative inline-block text-left">
          <div>
            <button type="button" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              <PlusIcon className="h-5 w-5 mr-2" />
              Neue Aktion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;