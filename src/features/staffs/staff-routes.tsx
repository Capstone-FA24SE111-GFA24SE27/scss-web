import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { staffDemandRoutes } from './demands';
import { staffStudentRoutes } from './students';
import { profileRoutes, settingsRoutes } from '@/shared/pages';

const StaffLayout = lazy(() => import('./staff-layout'));

export const supportStaffRoutes: RouteObject[] = [
	{
		path: '/',
		element: <StaffLayout />,
		children: [
			{
				path: '',
				element: <Navigate to={`students/list`} />
			},
			...specialRoutes,
			...staffDemandRoutes,
			...staffStudentRoutes,
			...profileRoutes,
			...settingsRoutes,
		],
	},
];
