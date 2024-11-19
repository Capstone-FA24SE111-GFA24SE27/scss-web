import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import CounselorDetails from './CounselorDetails';
import { adminCounselorDetailsRoutes } from './details';

const Counselor = lazy(() => import('./Counselors'));

export const adminCounselorsRoutes: RouteObject[] = [
	{
		path: 'counselors',
		element: <Counselor />,
		children: [],
	},
	...adminCounselorDetailsRoutes
];
