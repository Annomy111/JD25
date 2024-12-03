import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const GoogleCalendar = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="calendar-container" style={{ height: '700px' }}>
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=nvf3q8gvcrtm7ed3kfupcc0j78%40group.calendar.google.com&ctz=Europe%2FBerlin"
            style={{
              border: 0,
              width: '100%',
              height: '100%',
              frameBorder: 0,
              scrolling: 'no'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleCalendar;