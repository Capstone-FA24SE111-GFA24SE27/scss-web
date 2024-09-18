import React, { useEffect, useRef, useState } from 'react';
import {
	DateSelectArg,
	DatesSetArg,
	EventAddArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	EventDropArg,
	EventRemoveArg,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarHeader from './calendar-components/CalendarHeader';
import './index.css';
import CalendarAppEventContent from './calendar-components/CalendarAppEventContent';

const CalendarLayout = () => {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	// const { data: events, isLoading } = useGetCalendarEventsQuery();
	const calendarRef = useRef<FullCalendar>(null);


	// const [updateEvent] = useUpdateCalendarEventMutation();

	// useEffect(() => {
	// 	// Correct calendar dimentions after sidebar toggles
	// 	setTimeout(() => {
	// 		calendarRef.current?.getApi()?.updateSize();
	// 	}, 300);
	// }, [leftSidebarOpen]);

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		// dispatch(openNewEventDialog(selectInfo));
	};

	const handleEventDrop = (eventDropInfo: EventDropArg): void => {
		// const { id, title, allDay, start, end, extendedProps } = eventDropInfo.event;
		// updateEvent({
		// 	id,
		// 	title,
		// 	allDay,
		// 	start: start?.toISOString() ?? '',
		// 	end: end?.toISOString() ?? '',
		// 	extendedProps
		// });
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
	};

	const handleDates = (rangeInfo: DatesSetArg) => {
		setCurrentDate(rangeInfo);
	};

	const handleEventAdd = (addInfo: EventAddArg) => {
		// eslint-disable-next-line no-console
		console.info(addInfo);
	};

	const handleEventChange = (changeInfo: EventChangeArg) => {
		// eslint-disable-next-line no-console
		console.info(changeInfo);
	};

	const handleEventRemove = (removeInfo: EventRemoveArg) => {
		// eslint-disable-next-line no-console
		console.info(removeInfo);
	};

	function handleToggleLeftSidebar() {
		// setLeftSidebarOpen(!leftSidebarOpen);
	}

	return (
		<div className='flex flex-col flex-auto w-full p-8'>
			<CalendarHeader
				calendarRef={calendarRef}
				currentDate={currentDate!}
				onToggleLeftSidebar={handleToggleLeftSidebar}
			/>
			<div className='flex items-start flex-auto w-full h-full overflow-y-auto '>
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					headerToolbar={false}
					initialView='dayGridMonth'
					editable
					selectable
					selectMirror
					dayMaxEvents
					weekends
					datesSet={handleDates}
					select={handleDateSelect}
					events={[{ // this object will be "parsed" into an Event Object
						title: 'The Title', // a property!
						start: '2024-09-01', // a property!
						end: '2024-09-02' // a property! ** see important note below about 'end' **
					  }]}
					eventContent={(eventInfo: EventContentArg & { event: Event }) => (
						<CalendarAppEventContent eventInfo={eventInfo} />
					)}
							eventClick={handleEventClick}
							eventAdd={handleEventAdd}
							eventChange={handleEventChange}
							eventRemove={handleEventRemove}
							eventDrop={handleEventDrop}
							initialDate={new Date()}
							ref={calendarRef}
				/>
			</div>
		</div>
	);
};

export default CalendarLayout;
