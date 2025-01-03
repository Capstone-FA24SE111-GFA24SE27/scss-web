import { RouteObject } from 'react-router-dom';
import { adminQuestionCardRoutes } from './public-question-card';
import { adminContributedQuestionRoutes } from './faq/admin-faq-routes';

export const adminQuestionRoutes: RouteObject[] = [
	{
		path: 'questions',
		children: [
			...adminQuestionCardRoutes,
			...adminContributedQuestionRoutes,
		],
	},
];
