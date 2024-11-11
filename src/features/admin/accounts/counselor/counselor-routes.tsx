import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import CounselorDetails from './CounselorDetails';

const Counselor = lazy(() => import('./Counselor'));

export const CounselorsRoutes: RouteObject[] = [
	{
		path: 'counselors',
		element: <Counselor />,
		children: [],
	},
	{
		path: 'counselors/:id',
		element: <CounselorDetails />,
	},
];
