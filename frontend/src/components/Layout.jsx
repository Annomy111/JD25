import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  // Unterschiedliche Navigation für Admins und Freiwillige
  const getNavigation = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/' },
      { name: 'Termine', href: '/events' },
      { name: 'Chat', href: '/chat' },
      { name: 'Tür-zu-Tür', href: '/canvassing' },
    ];

    const adminItems = [
      ...commonItems,
      { name: 'Freiwillige', href: '/volunteers' },
      { name: 'Ressourcen', href: '/resources' },
      { name: 'Statistiken', href: '/stats' },
    ];

    const volunteerItems = [
      ...commonItems,
      { name: 'Meine Aktivitäten', href: '/activities' },
      { name: 'Schulungen', href: '/trainings' },
    ];

    return isAdmin ? adminItems : volunteerItems;
  };

  const navigation = getNavigation();

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 bg-gray-900">
            <span className="text-xl font-bold text-white">
              Campaign Manager
            </span>
          </div>
          {/* Navigation */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* User Menu */}
            <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isAdmin ? 'Administrator' : 'Freiwilliger'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;