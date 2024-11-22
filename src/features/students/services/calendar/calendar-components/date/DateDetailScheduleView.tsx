import { ContentLoading } from '@/shared/components';
import { useAppSelector } from '@shared/store';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { selectHolidays, selectScheduleData } from '../../calendar-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import { Typography } from '@mui/material';
import { EventDetailBody } from '../event/EventDetailBody';
import { EventHolidayBody } from '../event/EventHolidayBody';

const DateDetailScheduleView = () => {
	const routeParams = useParams();
	const navigate = useNavigate()

	const appointmentList = useAppSelector(selectScheduleData);
	const holidayList = useAppSelector(selectHolidays)

	const { date: dateRange } = routeParams;

	const [isLoading, setIsLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);
	const [holiday, setHoliday] = useState([])

	const dateData = dateRange.split('&');
	const startStr = dateData[0];
	const endStr = dateData[1];

	const startDate = new Date(startStr);
	const endDate = new Date(endStr);

	useEffect(() => {
		if (appointmentList) {
			setIsLoading(true);
			const eventsInDateRange = appointmentList.filter((item) => {
				const eventStartDate = new Date(item.startDateTime);
				const eventEndDate = new Date(item.endDateTime);

				return isDateRangeOverlapping(
					eventStartDate,
					eventEndDate,
					startDate,
					endDate
				);
			});
			setAppointments(eventsInDateRange);
			setIsLoading(false);
		}
	}, [appointmentList]);

	useEffect(() => {
		if (holidayList) {
			setIsLoading(true);
			const eventsInDateRange = holidayList.filter((item) => {
				const eventStartDate = new Date(item.startDate);
				const eventEndDate = new Date(item.endDate);

				return isDateRangeOverlapping(
					eventStartDate,
					eventEndDate,
					startDate,
					endDate
				);
			});
			setHoliday(eventsInDateRange);
			console.log(eventsInDateRange)
			setIsLoading(false);
		}
	}, [holidayList]);


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
		<div className='relative flex flex-col '>
			<div className='sticky top-0 left-0 z-10 flex flex-col w-full p-16 pb-32 bg-background-paper '>
				<Typography className='pr-32 mt-32 text-xl font-semibold leading-none'>
					Schedule from
				</Typography>
				<Typography className='pr-32 leading-none text-28'>
					{displayDate(startDate)} to {displayDate(endDate)}
				</Typography>
			</div>
            <div className='flex flex-col gap-12 p-16'>

			{
				holiday.length > 0 ? holiday.map((item) => (
					<div key={item.id} className='rounded shadow-md bg-background-paper '>
							<EventHolidayBody 
								holiday={item}
							/>
						</div>
				)) : 
					appointments.map((item) => (
						<div key={item.id} className='rounded shadow-md bg-background-paper '>
							<EventDetailBody
								appointment={item}
								onNavClicked={() => {navigate(-1)}}
								/>
						</div>
					))
				
			}
			
            </div>
		</div>
	);
};

export default DateDetailScheduleView;
