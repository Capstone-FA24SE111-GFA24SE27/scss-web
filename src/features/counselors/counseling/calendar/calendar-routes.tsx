import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { studentsRoutes } from '../student';
import { reportRoutes } from '../appointments/report';
const Calendar = lazy(() => import('./calendar-layout'));
const DateDetailScheduleView = lazy(
	() => import('./calendar-components/date/DateDetailScheduleView')
);
export const calendarRoutes: RouteObject[] = [
	{
		path: 'calendar',
		element: <Calendar />,
		children: [
			...studentsRoutes,
			...reportRoutes,
			{
				path: 'date/:date',
				element: <DateDetailScheduleView />,
			},
		],
	},
];
