import { CounselorView, StudentView, demandRoutes, studentRoutes } from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import UpdateDemandForm from './UpdateDemandForm';
import DemandDetail from '@/shared/pages/demand/DemandDetail';
// import CounselorView from './counselors/CounselorView';
const Demand = lazy(() => import('./Demand'));

export const staffDemandRoutes: RouteObject[] = [
	{
		path: 'demand',
		element: <Demand />,
		children: [
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
			{
				path: 'student/:id',
				element: <StudentView actionButton={null} />,
			},
			...studentRoutes,
			{
				path: 'update/:id',
				element: <UpdateDemandForm />
			},
			{
				path: ':id',
				element: <DemandDetail />
			}
		],
	},
];
