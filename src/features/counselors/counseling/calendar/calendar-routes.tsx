import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { reportRoutes } from '../appointments/report';
import { appointmentRoutes, studentRoutes } from '@/shared/pages';
const Calendar = lazy(() => import('./calendar-layout'));
const DateDetailScheduleView = lazy(() => import('./calendar-components/date/DateDetailScheduleView'));
export const calendarRoutes: RouteObject[] = [
	{
		path: 'calendar',
		element: <Calendar />,
		children: [
			{
				path: 'date/:date',
				children: [
					{
						index: true,
						element: <DateDetailScheduleView />,
					},
					...appointmentRoutes,
					...reportRoutes,
				]
			},
		],
	},
];
