import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';

const QuestionCard = lazy(() => import('./QuestionCardLayout'));

export const adminQuestionCardRoutes: RouteObject[] = [
	{
		path: 'question',
		element: <QuestionCard />,
		children: [
			// {
			// 	path: 'create',
			// 	element: <CreateQuestionCardCategoryForm />,
			// },
		],
	},
];
