import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import {
  addHolidays,
  addScheduleData,
  openEventDetailDialog,
  selectEventDialog,
  selectHolidays,
  selectScheduleData,
} from './schedule-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import ScheduleAppEventContent from './ScheduleAppEventContent';
import { date } from 'zod';
import { AppLoading, AppointmentItem, ContentLoading } from '@/shared/components';
import { useSocket } from '@/shared/context';
import { useNavigate } from 'react-router-dom';

import { Appointment, AppointmentScheduleType, HolidayScheduleType } from '@/shared/types';
import { useGetHolidayScheduleQuery } from '@/features/counselors/counseling';
import EventDetailDialog from './EventDetailDialog';
// import { useGetHolidayScheduleQuery } from '@/features/counselors/counseling';

type Props = {
  handleDates: (rangeInfo: DatesSetArg) => void;
  currentDate: DatesSetArg;
  calendarRef: React.MutableRefObject<FullCalendar>;
  getScheduleHook: any,
  id: number
};

const ScheduleBody = (props: Props) => {
  const { handleDates, currentDate, calendarRef, getScheduleHook , id} = props;

  const dispatch = useAppDispatch();
  const socket = useSocket();
  const account = useAppSelector(selectAccount);
  const navigate = useNavigate();
  const scheduleData = useAppSelector(selectScheduleData);
  const holidaysData = useAppSelector(selectHolidays);

  const [appointments, setAppointments] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [dateRange, setDateRange] = useState(null);


  const {
		data: data,
		isLoading,
		refetch: refetchSchedule,
	} = getScheduleHook({
    id,
    ...dateRange
  }, {
		skip: !dateRange,
	});

  const { data: holidayfetchData, isLoading: loading2 } = useGetHolidayScheduleQuery({});

  

  const eventDialog = useAppSelector(selectEventDialog);


  useEffect(() => {
    if (currentDate) {
      const fromDate = currentDate.startStr.split('T')[0];
      const toDate = currentDate.endStr.split('T')[0];

      setDateRange({
        fromDate,
        toDate,
      });
    }
  }, [currentDate]);


  useEffect(() => {
		if (data) {
			let newData: AppointmentScheduleType[] = [];
			if (scheduleData) {
				newData = data.content.filter(
					(item) =>
						scheduleData.findIndex(
							(schedule) => schedule.id === item.id
						) === -1
				);
			} else {
				newData = data.content;
			}

			if (newData.length > 0) dispatch(addScheduleData(newData));
		}
	}, [data]);

  useEffect(() => {
    if (holidaysData && holidaysData.length > 0) {
      const list = holidaysData.map((item) => {
        return {
          id: item.id + '-holiday',
          title: item.name,
          start: item.startDate,
          end: item.endDate,
          extendedProps: {
            isHoliday: true,
          },
        };
      });

      setHolidays(list);
    }
  }, [holidaysData]);

  useEffect(() => {
		if (scheduleData) {
			const list = scheduleData.map((item) => {
				return {
					id: item.id,
					title: 'Counselling session',
					start: item.startDateTime,
					end: item.endDateTime,
				};
			});

			setAppointments(list);
		}
	}, [scheduleData]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    clickInfo.jsEvent.preventDefault();
    if (clickInfo.event.extendedProps.isHoliday) {
      const chosenHoliday = holidayfetchData.content.find(
        (item) => item.id == clickInfo.event.id.split('-')[0]
      );
      dispatch(openEventDetailDialog(clickInfo, chosenHoliday, 'holiday'));
    } else {
      const chosenAppointment = data.content.find(
        (item) => item.id == clickInfo.event.id
      );

      console.log(`Chosen appointment: ${chosenAppointment}A`)
      dispatch(openEventDetailDialog(clickInfo, chosenAppointment, 'appointment'));
    }

  };

  const handleDatesWithin = (rangeInfo: DatesSetArg) => {
    if (handleDates) handleDates(rangeInfo);
  };

  return (
    <div className='flex items-start flex-auto w-full h-full '>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView='dayGridMonth'
        editable={false}
        selectable
        dayMaxEvents
        weekends
        slotMinTime={'7:00:00'}
        datesSet={handleDatesWithin}
        // select={handleDateSelect}
        events={[...appointments, ...holidays]}
        eventContent={(
          eventInfo: EventContentArg & { event: Event }
        ) => <ScheduleAppEventContent eventInfo={eventInfo} />}
        eventClick={handleEventClick}
        initialDate={new Date()}
        ref={calendarRef}
      />
      <EventDetailDialog />
    </div>
  );
};

export default ScheduleBody;
