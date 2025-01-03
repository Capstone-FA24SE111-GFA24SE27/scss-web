import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import CreateQuestionCardCategoryForm from './CreateQuestionCardCategoryForm';

export const adminQuestionCardCategoryRoutes: RouteObject[] = [
	{
		path: 'create',
		element: <CreateQuestionCardCategoryForm />,
	},
	{
		path: 'update/:id',
		element: <CreateQuestionCardCategoryForm />,
	},
];
