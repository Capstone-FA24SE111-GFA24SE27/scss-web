import { RouteObject } from 'react-router-dom';
import { problemTagsRoutes } from './problem-tag';
import { holidaysRoutes } from './holiday';
import { timeSlotRoutes } from './time-slot';
import { adminQuestionCardCategoryRoutes } from './question-card-category';
import { adminQuestionCardRoutes } from './question-card';
import { adminAcademicRoutes } from './academic';

export const resourcesRoutes: RouteObject[] = [
	{
		path: 'resources',
		children: [
			...problemTagsRoutes,
			...holidaysRoutes,
			...timeSlotRoutes,
			...adminQuestionCardCategoryRoutes,
			...adminQuestionCardRoutes,
			...adminAcademicRoutes,
		],
	},
];
