import React from 'react';

const Termine = () => {
  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl font-bold">Termine</h1>
      <div className="bg-white shadow rounded-lg" style={{ height: 'calc(100vh - 180px)' }}>
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=nvf3q8gvcrtm7ed3kfupcc0j78%40group.calendar.google.com&ctz=Europe%2FBerlin&mode=MONTH&showPrint=0&showTabs=1&showCalendars=0&showTz=0"
          style={{
            border: 0,
            width: '100%',
            height: '100%',
          }}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default Termine;