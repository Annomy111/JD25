import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value, total, label, color = 'blue' }) => {
  const percentage = Math.round((value / total) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-500">{percentage}%</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute h-full rounded-full bg-${color}-600`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value} von {total}</span>
        <span>Ziel: {total}</span>
      </div>
    </div>
  );
};

export default ProgressBar;