import { CounselorView, studentRoutes, StudentView } from '@/shared/pages';
import StudentList from '@/shared/pages/student-list/StudentList';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import CreateDemandForm from '../CreateDemandForm';
import CreateDemandButton from '../CreateDemandButton';
import FollowStudentButton from '../FollowStudentButton';

export const staffStudentsListRoutes: RouteObject[] = [
	{
		path: 'list',
		element: <StudentList isShowingTab={false} />,
		children: [
			{
				path: 'student/:id',
				element: <StudentView actionButton={<FollowStudentButton />} />,
			},
			{
				path: 'student/:id/create-demand',
				element: <CreateDemandForm />,
			},
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
			...studentRoutes,
		],
	
	},
];
