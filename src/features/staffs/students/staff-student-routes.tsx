import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { staffFollowedStudentsRoutes } from './followed-list/followed-students-routes';
import { staffRecommendedStudentsRoutes } from './recommended-list/recommended-students-routes';
import { staffStudentsListRoutes } from './students-list/students-list-routes';


export const staffStudentRoutes: RouteObject[] = [
	{

		path:'students',
		children: [
			...staffFollowedStudentsRoutes,
			...staffStudentsListRoutes,
			...staffRecommendedStudentsRoutes
		]
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
