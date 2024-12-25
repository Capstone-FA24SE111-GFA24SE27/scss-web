import Box from '@mui/material/Box';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { EventContentArg } from '@fullcalendar/core';
import { useEffect, useState } from 'react';

type CalendarAppEventContentProps = {
	eventInfo: EventContentArg & { event: Event };
};

/**
 * The event content for the calendar app.
 */
function CalendarAppEventContent(props: CalendarAppEventContentProps) {
	const { eventInfo } = props;
	const [color, setColor] = useState('#e67e22');
	
	useEffect(() => {
		if (eventInfo.event.extendedProps.isHoliday) {
			setColor('#feaa2e');
		}
	}, [eventInfo]);

	return (
		<Box
			sx={{
				backgroundColor: color,
				color: '#eee',
			}}
			className={clsx(
				'flex items-center w-full rounded-4 px-8 py-2 h-22 text-white h-full cursor-pointer select-none',
				eventInfo.view.type === 'dayGridMonth' ? 'flex-row' : 'flex-col'
			)}
		>
			<Typography className='font-semibold text-12'>
				{eventInfo.timeText}
			</Typography>
			<Typography className='px-4 truncate text-12'>
				{eventInfo.event.title}
			</Typography>
		</Box>
	);
}

export default CalendarAppEventContent;
