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
import {
	addHolidays,
	addScheduleData,
	clearScheduleData,
	openEventDetailDialog,
	selectHolidays,
	selectScheduleData,
} from '../calendar-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import CalendarAppEventContent from './CalendarAppEventContent';
import EventDetailDialog from './event/EventDetailDialog';
import {
	useGetAppointmentScheduleQuery,
} from '../calendar-api';
import { date } from 'zod';
import { AppLoading, ContentLoading } from '@/shared/components';
import { useAppointmentsSocketListener, useSocket } from '@/shared/context';
import { useNavigate } from 'react-router-dom';

import { AppointmentScheduleType, HolidayScheduleType } from '@/shared/types';
import { useGetHolidayScheduleQuery } from '../../counseling-api';

type Props = {
	handleDates: (rangeInfo: DatesSetArg) => void;
	currentDate: DatesSetArg;
	calendarRef: React.MutableRefObject<FullCalendar>;
};

const CalendarBody = (props: Props) => {
	const { handleDates, currentDate, calendarRef } = props;

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
	} = useGetAppointmentScheduleQuery(dateRange, {
		skip: !dateRange,
	});

	const { data: holidayfetchData, isLoading: loading2 } =
		useGetHolidayScheduleQuery({});

	// useEffect(() => {
	// 	const cb = (data: any) => {
	// 		console.log('socket schedule', data);
	// 		if (data) {
	// 			refetchSchedule();
	// 		}
	// 	};
	// 	if (socket && account) {
	// 		console.log(`/user/${account.profile.id}/appointment`, account);

	// 		socket.on(`/user/${account.profile.id}/appointment`, cb);
	// 	}

	// 	return () => {
	// 		if (socket && account) {
	// 			socket.off(`/user/${account.profile.id}/appointment`, cb);
	// 		}
	// 	};
	// }, [socket]);

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

			if (newData.length > 0) {
				console.log('newdata', newData);
				dispatch(addScheduleData(newData));
			}
		}
		return () => {
			dispatch(clearScheduleData())
		}
	}, [data]);

	useEffect(() => {
		if (holidayfetchData) {
			let newData: HolidayScheduleType[] = [];

			if (holidaysData) {
				newData = holidayfetchData.content.filter(
					(item) =>
						holidaysData.findIndex(
							(holiday) => holiday.id === item.id
						) === -1
				);
			} else {
				newData = holidayfetchData.content;
			}

			if (newData.length > 0) dispatch(addHolidays(newData));
		}
	}, [holidayfetchData]);

	useEffect(() => {
		if (scheduleData && scheduleData.length > 0) {
			const list = scheduleData.map((item) => {
				return {
					id: item.id,
					title: 'Counselling session',
					start: item.startDateTime,
					end: item.endDateTime,
				};
			});
			console.log('setapp', list);

			setAppointments(list);
		}
	}, [scheduleData]);

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

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		console.log('dateselect, ', selectInfo);
		const param = selectInfo.startStr + '&' + selectInfo.endStr;
		navigate(`date/${param}`);
	};

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
			dispatch(openEventDetailDialog(clickInfo, chosenAppointment, 'appointment'));
		}

	};

	const handleDatesWithin = (rangeInfo: DatesSetArg) => {
		if (handleDates) handleDates(rangeInfo);
	};

	useAppointmentsSocketListener(account?.profile.id, refetchSchedule)

	if (isLoading || loading2) {
		return <ContentLoading className='m-32' />;
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
				events={[...appointments, ...holidays]}
				eventContent={(
					eventInfo: EventContentArg & { event: Event }
				) => <CalendarAppEventContent eventInfo={eventInfo} />}
				eventClick={handleEventClick}
				initialDate={new Date()}
				ref={calendarRef}
			/>
			<EventDetailDialog />
		</div>
	);
};

export default CalendarBody;
