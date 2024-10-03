import React, { useEffect, useRef, useState } from 'react';
import { DatesSetArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { useAppDispatch } from '@shared/store';
import { styled } from '@mui/material';
import { PageSimple } from '@/shared/components';
import CalendarHeader from './calendar-components/CalendarHeader';
import CalendarBody from './calendar-components/CalendarBody';
import { useNavigate, useParams } from 'react-router-dom';
import CalendarSidebarContent from './calendar-components/CalendarSidebarContent';

const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper,
	},
}));

const CalendarLayout = () => {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const calendarRef = useRef<FullCalendar>(null);
	const pageLayout = useRef(null);
	const navigate = useNavigate()
	const routeParams = useParams();

	const isMobile = false;

	useEffect(() => {
		if (routeParams.id || routeParams.date) {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false)
		}
	}, [routeParams]);

	const handleCloseRightSideBar = () => {
		navigate('')
	}

	return (
		<Root
			header={
				<CalendarHeader
					calendarRef={calendarRef}
					currentDate={currentDate!}
				/>
			}
			content={
				<CalendarBody
					handleDates={setCurrentDate}
					currentDate={currentDate}
					calendarRef={calendarRef}
				/>
			}
			ref={pageLayout}
			rightSidebarContent={<CalendarSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={handleCloseRightSideBar}
			rightSidebarWidth={640}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
};

export default CalendarLayout;
