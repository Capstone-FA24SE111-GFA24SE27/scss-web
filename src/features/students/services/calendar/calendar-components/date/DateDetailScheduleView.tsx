import { ContentLoading } from '@/shared/components';
import { useAppSelector } from '@shared/store';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectScheduleData } from '../../calendar-slice';
import { isDateRangeOverlapping } from '@/shared/utils';
import { Typography } from '@mui/material';
import { EventDetailBody } from '../event/EventDetailBody';

const DateDetailScheduleView = () => {
	const routeParams = useParams();

	const appointmentList = useAppSelector(selectScheduleData);

	const { date: dateRange } = routeParams;

	const [isLoading, setIsLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);
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
				<Typography className='pr-32 font-semibold leading-none text-28'>
					Schedule for
				</Typography>
				<Typography className='pr-32 leading-none text-28'>
					{displayDate(startDate)} to {displayDate(endDate)}
				</Typography>
			</div>
            <div className='flex flex-col gap-12 p-16'>

			{appointments.map((item) => (
                <div className='rounded shadow-md bg-background-paper '>
					<EventDetailBody
						appointment={item}
						onNavClicked={() => {}}
                        />
				</div>
			))}
            </div>
		</div>
	);
};

export default DateDetailScheduleView;
