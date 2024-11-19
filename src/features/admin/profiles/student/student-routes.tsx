import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import StudentDetails from './StudentDetails';

const Students = lazy(() => import('./Students'));

export const adminStudentsRoutes: RouteObject[] = [
	{
		path: 'students',
		element: <Students />,
		children: [],
	},
	{
		path: 'students/:id',
		element: <StudentDetails />,
	},
];
