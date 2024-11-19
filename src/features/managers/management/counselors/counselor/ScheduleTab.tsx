import CalendarBody from '@/features/counselors/counseling/calendar/calendar-components/CalendarBody'
import CalendarHeader from '@/features/counselors/counseling/calendar/calendar-components/CalendarHeader'
import { DatesSetArg } from '@fullcalendar/core/index.js';
import FullCalendar from '@fullcalendar/react';
import React, { useRef, useState } from 'react'

const ScheduleTab = () => {
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);
  return (
    <div>
      <CalendarHeader
        calendarRef={calendarRef}
        currentDate={currentDate!}
      />
      <CalendarBody
        handleDates={setCurrentDate}
        currentDate={currentDate}
        calendarRef={calendarRef}
      />
    </div>
  )
}

export default ScheduleTab