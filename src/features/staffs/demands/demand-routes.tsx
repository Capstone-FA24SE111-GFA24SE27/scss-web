import { StudentView, studentRoutes } from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AssignDemandForm from './AssignDemandForm';
const Demand = lazy(() => import('./Demand'));

export const demandRoutes: RouteObject[] = [
	{
		path: 'demand',
		element: <Demand />,
		children: [
			{
				path: 'student/:id',
				element: <StudentView actionButton={null} />,
			},
			...studentRoutes,
			{
				path: 'assign/:id',
				element: <AssignDemandForm />
			}
		],
	},
];
