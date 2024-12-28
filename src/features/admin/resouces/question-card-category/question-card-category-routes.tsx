import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import CreateQuestionCardCategoryForm from './CreateQuestionCardCategoryForm';

const QuestionCardCategory = lazy(() => import('./QuestionCardLayout'));

export const adminQuestionCardCategoryRoutes: RouteObject[] = [
	{
		path: 'question-category',
		element: <QuestionCardCategory />,
		children: [
			{
				path: 'create',
				element: <CreateQuestionCardCategoryForm />,
			},
		],
	},
];
