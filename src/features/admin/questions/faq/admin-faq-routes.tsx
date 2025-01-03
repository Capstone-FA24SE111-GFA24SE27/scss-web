import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { adminQuestionCardCategoryRoutes } from './question-card-category';

const ContributedQuestionCard = lazy(() => import('./ContributedQuestionCardLayout'));

export const adminContributedQuestionRoutes: RouteObject[] = [
	{
		path: 'faq',
		element: <ContributedQuestionCard />,
		children: [
			...adminQuestionCardCategoryRoutes
		],
	},
];
