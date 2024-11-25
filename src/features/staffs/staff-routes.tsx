import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { demandRoutes } from './demands';
import { staffStudentRoutes } from './students';
import { profileRoutes, settingsRoutes } from '@/shared/pages';
import { qnaStaffRoutes } from './qna';

const StaffLayout = lazy(() => import('./staff-layout'));

export const supportStaffRoutes: RouteObject[] = [
	{
		path: '/',
		element: <StaffLayout />,
		children: [
			{
				path: '',
				element: <Navigate to={`questions`} />
			},
			...specialRoutes,
			...demandRoutes,
			...staffStudentRoutes,
			...profileRoutes,
			...settingsRoutes,
			...qnaStaffRoutes
			// ...recommendedStudentsRoutes
		],
	},
];
