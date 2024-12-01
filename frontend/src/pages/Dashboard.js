import React from 'react';
import {
  UsersIcon,
  HomeIcon,
  DocumentIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import EventCard from '../components/EventCard';
import ProgressBar from '../components/ProgressBar';
import ActivityFeed from '../components/ActivityFeed';
import DashboardHeader from '../components/DashboardHeader';

const Dashboard = () => {
  const stats = [
    { title: 'Freiwillige Gesamt', value: '0', icon: UsersIcon, trend: 0 },
    { title: 'Haustüren besucht', value: '0', icon: HomeIcon, trend: 0 },
    { title: 'Flyer verteilt', value: '0', icon: DocumentIcon, trend: 0 },
    { title: 'Aktive Events', value: '0', icon: CalendarIcon },
  ];

  const campaignProgress = {
    doors: { current: 0, target: 10000 },
    volunteers: { current: 0, target: 100 },
    events: { current: 0, target: 50 },
  };

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard"
        subtitle="Willkommen im Campaign Manager für den Wahlkreis 113"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Campaign Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Kampagnen-Fortschritt
            </h3>
            <div className="space-y-6">
              <ProgressBar
                label="Haustürbesuche"
                value={campaignProgress.doors.current}
                total={campaignProgress.doors.target}
                color="blue"
              />
              <ProgressBar
                label="Freiwillige"
                value={campaignProgress.volunteers.current}
                total={campaignProgress.volunteers.target}
                color="green"
              />
              <ProgressBar
                label="Events"
                value={campaignProgress.events.current}
                total={campaignProgress.events.target}
                color="purple"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Letzte Aktivitäten
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-500">
                Alle anzeigen
              </button>
            </div>
            <ActivityFeed />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Anstehende Events
              </h3>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200">
                + Event erstellen
              </button>
            </div>
            <div className="space-y-4">
              <EventCard />
            </div>
          </div>

          {/* Top Volunteers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Top Freiwillige
              </h3>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Dieser Monat
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Keine Daten verfügbar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;