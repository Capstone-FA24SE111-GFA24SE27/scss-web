import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import CreateProblemTagForm from './CreateProblemTagForm';
import CreateCategoryForm from './CreateCategoryForm';

const ProblemTag = lazy(() => import('./ProblemTag'));

export const problemTagsRoutes: RouteObject[] = [
	{
		path: 'tags',
		element: <ProblemTag />,
		children: [
			{
				path: 'category/create',
				element: <CreateCategoryForm />,
			},
			{
				path: 'category/update/:id',
				element: <CreateCategoryForm />,
			},
			{
				path: 'create',
				element: <CreateProblemTagForm />,
			},
			{
				path: 'update/:id',
				element: <CreateProblemTagForm />,
			},
		],
	},
];
