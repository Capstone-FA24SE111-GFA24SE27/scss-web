import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { demandRoutes } from './demands';
import { staffStudentRoutes } from './students/staff-student-routes';
import { recommendedStudentsRoutes } from './recommends';

const StaffLayout = lazy(() => import('./staff-layout'));

export const supportStaffRoutes: RouteObject[] = [
	{
		path: '/',
		element: <StaffLayout />,
		children: [
			...specialRoutes,
			...demandRoutes,
			...staffStudentRoutes,
			// ...recommendedStudentsRoutes
		],
	},
];
