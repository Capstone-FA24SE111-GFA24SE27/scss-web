import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import CreateTimeSlotForm from './CreateTimeSlotForm';

const TimeSlot = lazy(() => import('./TimeSlotLayout'));

export const timeSlotRoutes: RouteObject[] = [
	{
		path: 'slots',
		element: <TimeSlot />,
		children: [
			{
				path: 'create',
				element: <CreateTimeSlotForm />,
			},
		],
	},
];
