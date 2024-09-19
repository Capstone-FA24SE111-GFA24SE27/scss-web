import React, {  useRef, useState } from 'react';
import {
	DateSelectArg,
	DatesSetArg,
	EventClickArg,
	EventContentArg,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarHeader from './calendar-components/CalendarHeader';
import './index.css';
import CalendarAppEventContent from './calendar-components/CalendarAppEventContent';
import { useAppDispatch } from '@shared/store';
import { openDayDetailDialog, openEventDetailDialog } from './calendar-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import EventDetailDialog from './calendar-components/dialog/EventDetailDialog';
import DateDetailDialog from './calendar-components/dialog/DateDetailDialog';

const CalendarLayout = () => {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	// const { data: events, isLoading } = useGetCalendarEventsQuery();
	const calendarRef = useRef<FullCalendar>(null);

	const dispatch = useAppDispatch();

	const eventList = [
		{
			// this object will be "parsed" into an Event Object
			title: 'Test Event', // a property!
			start: '2024-09-01T10:30', // a property!
			end: '2024-09-01T15:30', // a property! ** see important note below about 'end' **
		},
		{
			// this object will be "parsed" into an Event Object
			title: 'Test Event', // a property!
			start: '2024-09-02T16:30', // a property!
			end: '2024-09-02T20:30', // a property! ** see important note below about 'end' **
		},
		{
			// this object will be "parsed" into an Event Object
			title: 'Test Event', // a property!
			start: '2024-09-15T10:30', // a property!
			end: '2024-09-15T15:30', // a property! ** see important note below about 'end' **
		},
	];

	const handleDateSelect = (selectInfo: DateSelectArg) => {

		const eventsInSelectedDate = eventList.filter((event) => isDateRangeOverlapping(new Date(event.start), new Date(event.end), selectInfo.start, selectInfo.end));
		dispatch(openDayDetailDialog(selectInfo, eventsInSelectedDate));
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
		dispatch(openEventDetailDialog(clickInfo));

	};

	const handleDates = (rangeInfo: DatesSetArg) => {
		setCurrentDate(rangeInfo);
	};

	return (
		<div className='flex flex-col flex-auto w-full p-10'>
			<h5 className='text-4xl font-medium '>Your schedule</h5>

			<CalendarHeader
				calendarRef={calendarRef}
				currentDate={currentDate!}
			/>
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
					datesSet={handleDates}
					select={handleDateSelect}
					events={eventList}
					eventContent={(
						eventInfo: EventContentArg & { event: Event }
					) => <CalendarAppEventContent eventInfo={eventInfo} />}
					eventClick={handleEventClick}
					initialDate={new Date()}
					ref={calendarRef}
				/>
			</div>
			<EventDetailDialog />
			<DateDetailDialog />
		</div>
	);
};

export default CalendarLayout;
