import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { reportRoutes } from '../appointments/report';
import { studentRoutes } from '@/shared/pages';
const Calendar = lazy(() => import('./calendar-layout'));
const DateDetailScheduleView = lazy(
	() => import('./calendar-components/date/DateDetailScheduleView')
);
export const calendarRoutes: RouteObject[] = [
	{
		path: 'calendar',
		element: <Calendar />,
		children: [
			...studentRoutes,
      ...reportRoutes,
			{
				path: 'date/:date',
				element: <DateDetailScheduleView />,
			},
		],
	},
];
