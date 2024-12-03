import React from 'react';
import { motion } from 'framer-motion';

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.length === 0 ? (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative pb-8"
          >
            <div className="relative flex items-center space-x-3 bg-white rounded-lg px-6 py-5 shadow-sm border border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">
                  Keine neuen Aktivitäten
                </p>
              </div>
            </div>
          </motion.li>
        ) : (
          activities.map((activity, index) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pb-8"
            >
              {index !== activities.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-center space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    activity.type === 'event' ? 'bg-blue-500' :
                    activity.type === 'task' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}>
                    {/* Icon based on activity type */}
                    <activity.icon className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">
                      {activity.user}
                    </span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium text-gray-900">
                      {activity.target}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </div>
            </motion.li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityFeed;