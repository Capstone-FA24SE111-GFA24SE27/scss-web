import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import DateDetailScheduleView from './calendar-components/date/DateDetailScheduleView';
import { CounselorView } from '@/shared/pages';
import { appointmentRoutes } from '@/shared/pages';

const Calendar = lazy(() => import('./calendar-layout'));
export const studentCalendarRoutes: RouteObject[] = [
	{
		path: 'calendar',
		element: <Calendar />,
		children: [
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
			{
				path: 'date/:date',

				children: [
					{
						index: true,
						element: <DateDetailScheduleView />,
					},
					...appointmentRoutes,
				],
			},
			...appointmentRoutes,
		],
	},
];
