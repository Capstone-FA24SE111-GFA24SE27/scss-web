import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentRoutes } from './details';

const Students = lazy(() => import('./Students'));

export const adminStudentsRoutes: RouteObject[] = [
	{
		path: 'students',
		element: <Students />,
		children: [],
	},
	...studentRoutes
]
