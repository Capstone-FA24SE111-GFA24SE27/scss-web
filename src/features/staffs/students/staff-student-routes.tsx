import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { staffFollowedStudentsRoutes } from './followed-list/followed-students-routes';
import { staffRecommendedStudentsRoutes } from './recommended-list/recommended-students-routes';
import { staffStudentsListRoutes } from './students-list/students-list-routes';
import { CounselorView } from '@/shared/pages';

const CreateDemandForm = lazy(() => import('./CreateDemandForm'));
const CounselorListForStaff = lazy(
	() => import('../counselors/CounselorListForStaff')
);

export const staffStudentRoutes: RouteObject[] = [
	{
		path: 'students',
		children: [
			...staffFollowedStudentsRoutes,
			...staffStudentsListRoutes,
			...staffRecommendedStudentsRoutes,
			{
				path: 'create-demand/:studentId',
				element: <CreateDemandForm />,
				children: [
					{
						path: 'counselor/:id',
						element: <CounselorView shouldShowBooking={false} />,
					},
				],
			},
			{
				path: 'create-demand/:studentId/counselors',
				element: <CounselorListForStaff />,
			},
		],
		// path: 'student-list',
		// element: <StudentList isShowingTab={true} />,
		// children: [
		// 	{
		// 		path: 'student/:id',
		// 		element: <StudentView  />,
		// 	},
		// 	{
		// 		path: 'student/:id/create-demand',
		// 		element: <CreateDemandForm  />,
		// 	},
		// 	{
		// 		path: 'counselor/:id',
		// 		element: <CounselorView shouldShowBooking={false} />,
		// 	},
		// 	...studentRoutes,
	},
];
