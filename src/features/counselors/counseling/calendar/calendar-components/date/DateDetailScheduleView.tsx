import { ContentLoading } from '@/shared/components';
import { useAppSelector } from '@shared/store';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectHolidays, selectScheduleData } from '../../calendar-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import { Divider, Typography } from '@mui/material';
import { EventDetailBody } from '../event/EventDetailBody';
import { EventHolidayBody } from '../event/EventHolidayBody';
import { CalendarMonth } from '@mui/icons-material';
import { useGetAppointmentScheduleQuery } from '../../calendar-api';
import { AppointmentScheduleType } from '@/shared/types';

const DateDetailScheduleView = () => {
	const routeParams = useParams();

	const appointmentList = useAppSelector(selectScheduleData);
	const holidayList = useAppSelector(selectHolidays)
	console.log(appointmentList)
	const { date: dateRange } = routeParams;

	const [isLoading, setIsLoading] = useState(false);
	// const [appointments, setAppointments] = useState([]);
	const [holiday, setHoliday] = useState([])
	const dateData = dateRange.split('&');

	const startStr = dateData[0];
	const endStr = dateData[1];

	const startDate = new Date(startStr);
	const endDate = new Date(endStr);

	const {
		data: data,
		isLoading: isLoadingAppointments,
		refetch: refetchSchedule,
	} = useGetAppointmentScheduleQuery({
		fromDate: startStr.split('T')[0],
		toDate: startStr.split('T')[0]
	}, {
		skip: !dateRange,
	});

	const appointments = data?.content
	// useEffect(() => {
	// 	if (appointmentList) {
	// 		setIsLoading(true);
	// 		const eventsInDateRange = appointmentList.filter((item) => {
	// 			const eventStartDate = new Date(item.startDateTime);
	// 			const eventEndDate = new Date(item.endDateTime);

	// 			return isDateRangeOverlapping(
	// 				eventStartDate,
	// 				eventEndDate,
	// 				startDate,
	// 				endDate
	// 			);
	// 		});
	// 		setAppointments(eventsInDateRange);
	// 		console.log(eventsInDateRange)
	// 		setIsLoading(false);
	// 	}
	// }, [appointmentList]);

	// useEffect(() => {
	// 	if (holidayList) {
	// 		setIsLoading(true);
	// 		const eventsInDateRange = holidayList.filter((item) => {
	// 			const eventStartDate = new Date(item.startDate);
	// 			const eventEndDate = new Date(item.endDate);

	// 			return isDateRangeOverlapping(
	// 				eventStartDate,
	// 				eventEndDate,
	// 				startDate,
	// 				endDate
	// 			);
	// 		});
	// 		setHoliday(eventsInDateRange);
	// 		console.log(eventsInDateRange)
	// 		setIsLoading(false);
	// 	}
	// }, [holidayList]);

	if (isLoading) {
		return <ContentLoading className='m-32' />;
	}

	const displayDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div className='relative flex flex-col'>
			<div className='flex w-full gap-8 p-16 mt-40'>
				<Typography className='text-3xl leading-none'>
					Schedule for
				</Typography>
				<Typography className='text-3xl font-semibold leading-none'>
					{displayDate(startDate)}
				</Typography>
			</div>
			<Divider />

			<div className='flex flex-col gap-16 p-16'>
				{
					holiday.length > 0 ? holiday.map((item) => (
						<div key={item.id} className='rounded shadow-md bg-background-paper '>
							<EventHolidayBody
								holiday={item}
							/>
						</div>
					)) :
						isLoadingAppointments
							? <ContentLoading />
							: appointments?.map((item) => (
								<EventDetailBody
									key={item.id}
									// @ts-ignore
									appointment={item as AppointmentScheduleType}
									onNavClicked={() => { }}
								/>
							))
				}
			</div>
		</div>
	);
};

export default DateDetailScheduleView;
