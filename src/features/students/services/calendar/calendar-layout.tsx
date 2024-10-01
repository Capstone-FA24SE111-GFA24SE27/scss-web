import React, {  useEffect, useRef, useState } from 'react';
import {
	DatesSetArg,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { useAppDispatch } from '@shared/store';
import { styled } from '@mui/material';
import { PageSimple } from '@/shared/components';
import CalendarHeader from './calendar-components/CalendarHeader';
import CalendarBody from './calendar-components/CalendarBody';
import { useParams } from 'react-router-dom';
import CalendarSidebarContent from './calendar-components/CalendarSidebarContent';

const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper
	},
}));

const CalendarLayout = () => {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const calendarRef = useRef<FullCalendar>(null);
	const pageLayout = useRef(null)

	const dispatch = useAppDispatch();
	const routeParams = useParams();

	useEffect(()=>{
		console.log('date ', currentDate)
	},[currentDate])

	const isMobile = false;

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

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


	return (

		<Root
		header={<CalendarHeader
			calendarRef={calendarRef}
			currentDate={currentDate!}
		/>}
		content={<CalendarBody handleDates={setCurrentDate} currentDate={currentDate} calendarRef={calendarRef}/>}
		ref={pageLayout}
		rightSidebarContent={<CalendarSidebarContent />}
		rightSidebarOpen={rightSidebarOpen}
		rightSidebarOnClose={() => setRightSidebarOpen(false)}
		rightSidebarWidth={640}
		rightSidebarVariant="temporary"
		scroll={isMobile ? 'normal' : 'content'}
	/>
		
	);
};

export default CalendarLayout;
