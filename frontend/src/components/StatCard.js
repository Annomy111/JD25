import React from 'react';

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg group">
      <div className="px-4 py-5 sm:p-6">
        {Icon && <Icon className="h-8 w-8 text-blue-500 mb-3 group-hover:text-blue-600 transition-colors duration-300" />}
        <dt className="text-sm font-medium text-gray-500 truncate">
          {title}
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {value}
        </dd>
      </div>
    </div>
  );
};

export default StatCard;