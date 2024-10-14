import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import { HolidayScheduleType } from '@/shared/types';

type Props = {
	holiday: HolidayScheduleType;
};

export const EventHolidayBody = (props: Props) => {
	const { holiday } = props;

	if (!holiday) {
		return null;
	}

	return (
		<div className='flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-480 '>
			<div className='flex flex-col w-full gap-16'>
				<div className='flex gap-24'>
					<div className='flex items-center gap-8 '>
						<CalendarMonth />
						<Typography className=''>
							{dayjs(holiday.startDate).format('YYYY-MM-DD')}
						</Typography>
					</div>
				</div>
				<Typography className='text-3xl font-semibold'>
					{holiday.name}
				</Typography>
				<div className=''>
					<Typography className='text-sm text-grey-700'>Description:</Typography>
					<Typography className=''>{holiday.description}</Typography>
				</div>
			</div>
		</div>
	);
};
