import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  CalendarIcon, 
  ChatBubbleLeftIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  // Gemeinsame Menüpunkte für alle Benutzer
  const commonMenuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/termine', name: 'Termine', icon: CalendarIcon },
    { path: '/chat', name: 'Chat', icon: ChatBubbleLeftIcon },
    { path: '/tuer-zu-tuer', name: 'Tür-zu-Tür', icon: MapIcon },
    { path: '/meine-aktivitaeten', name: 'Meine Aktivitäten', icon: ClipboardDocumentListIcon },
    { path: '/schulungen', name: 'Schulungen', icon: BookOpenIcon },
  ];

  // Admin-spezifische Menüpunkte
  const adminMenuItems = [
    { path: '/volunteers', name: 'Freiwillige Verwalten', icon: UserGroupIcon },
    { path: '/statistiken', name: 'Statistiken', icon: ChartBarIcon },
    { path: '/asana', name: 'Aufgaben (Asana)', icon: ClipboardDocumentListIcon },
  ];

  // Wähle die richtigen Menüpunkte basierend auf der Rolle
  const menuItems = [...commonMenuItems, ...(isAdmin ? adminMenuItems : [])];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white w-64">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Campaign Manager</h1>
        <p className="text-sm text-gray-400 mt-1">Wahlkreis 113</p>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors duration-200 ${
                location.pathname === item.path ? 'bg-gray-800 text-white' : ''
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center mb-2">
          <UserGroupIcon className="h-5 w-5 mr-2" />
          <div>
            <span className="block">{user?.name || 'Benutzer'}</span>
            <span className="text-sm text-gray-400">{isAdmin ? 'Administrator' : 'Freiwilliger'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full text-left text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200"
        >
          Abmelden
        </button>
      </div>
    </div>
  );
};

export default Sidebar;