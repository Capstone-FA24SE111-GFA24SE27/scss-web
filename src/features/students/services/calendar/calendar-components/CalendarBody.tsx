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
import './index.css';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { addScheduleData, openDayDetailDialog, openEventDetailDialog, selectScheduleData } from '../calendar-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import CalendarAppEventContent from './CalendarAppEventContent';
import EventDetailDialog from './dialog/EventDetailDialog';
import DateDetailDialog from './dialog/DateDetailDialog';
import { AppointmentScheduleType, useGetAppointmentScheduleQuery } from '../calendar-api';
import { date } from 'zod';
import { AppLoading } from '@/shared/components';
import { useSocket } from '@/shared/context';

type Props = {
	handleDates: (rangeInfo: DatesSetArg) => void;
	currentDate: DatesSetArg;
	calendarRef: React.MutableRefObject<FullCalendar>;
};

const CalendarBody = (props: Props) => {
	const { handleDates, currentDate, calendarRef } = props;

	const dispatch = useAppDispatch();
	const socket = useSocket()
	const account = useAppSelector(selectAccount);

	const scheduleData = useAppSelector(selectScheduleData)

	
	const [appointments, setAppointments] = useState([]);
	const [dateRange, setDateRange] = useState(null);

	const { data: data, isLoading } = useGetAppointmentScheduleQuery(
		dateRange,
		{
			skip: !dateRange,
		}
	);

	useEffect(() => {
		const cb = (data: AppointmentScheduleType) => {
			dispatch(addScheduleData(data));
			console.log('socket schedule', data);
			
		};
		if (socket && account) {
			socket.on(`/user/${account.profile.id}/private/notification`, cb);
		}

		return () => {
			if (socket && account) {
				socket.off(`/user/${account.profile.id}/private/notification`, cb);
			}
		};
	}, [socket]);

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
		console.log('asdw ', data);
		if (data) {
			
			dispatch(addScheduleData(data.content))
		}
	}, [data]);

	useEffect(()=>{
		console.log(' schedule data ', scheduleData)
		if(scheduleData){
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

	},[scheduleData])



	const handleDateSelect = (selectInfo: DateSelectArg) => {
		console.log('dateselect, ', selectInfo);
		const eventsInSelectedDate = appointments.filter((event) =>
			isDateRangeOverlapping(
				new Date(event.start),
				new Date(event.end),
				selectInfo.start,
				selectInfo.end
			)
		);
		dispatch(openDayDetailDialog(selectInfo, eventsInSelectedDate));
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
		const chosenAppointment = data.content.find(item => item.id == clickInfo.event.id)

		dispatch(openEventDetailDialog(clickInfo, chosenAppointment));
	};

	const handleDatesWithin = (rangeInfo: DatesSetArg) => {
		if (handleDates) handleDates(rangeInfo);
	};

	if (isLoading) {
		return <AppLoading />;
	}

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
				select={handleDateSelect}
				events={appointments}
				eventContent={(
					eventInfo: EventContentArg & { event: Event }
				) => <CalendarAppEventContent eventInfo={eventInfo} />}
				eventClick={handleEventClick}
				initialDate={new Date()}
				ref={calendarRef}
			/>
			<EventDetailDialog />
			<DateDetailDialog />
		</div>
	);
};

export default CalendarBody;
