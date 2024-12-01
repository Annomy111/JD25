import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  MapIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Freiwillige', href: '/volunteers', icon: UsersIcon },
    { name: 'Termine', href: '/events', icon: CalendarIcon },
    { name: 'Ressourcen', href: '/resources', icon: DocumentTextIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
    { name: 'Tür-zu-Tür', href: '/canvassing', icon: MapIcon },
    { name: 'Statistiken', href: '/stats', icon: ChartBarIcon },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center h-16 px-4 bg-gray-800 border-b border-gray-700">
        <span className="text-xl font-bold text-white">Campaign Manager</span>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-150 ease-in-out ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {item.name}
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;