import { RouteObject } from 'react-router-dom';
import { problemTagsRoutes } from './problem-tag';
import { holidaysRoutes } from './holiday';
import { timeSlotRoutes } from './time-slot';
import { adminAcademicRoutes } from './academic';

export const resourcesRoutes: RouteObject[] = [
	{
		path: 'resources',
		children: [
			...problemTagsRoutes,
			...holidaysRoutes,
			...timeSlotRoutes,
			...adminAcademicRoutes,
		],
	},
];
