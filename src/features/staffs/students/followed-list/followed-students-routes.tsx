import { CounselorView, studentRoutes, StudentView } from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import CreateDemandButton from '../CreateDemandButton';

const StaffFollowedStudentLayout = lazy(
	() => import('./StaffFollowedStudentsLayout')
);
// const CounselorListForStaff = lazy(
// 	() => import('../../counselors/CounselorListForStaff')
// );

export const staffFollowedStudentsRoutes: RouteObject[] = [
	{
		path: 'followed',
		element: <StaffFollowedStudentLayout />,
		children: [
			{
				path: 'student/:id',
				element: <StudentView actionButton={<CreateDemandButton />} />,
			},
			// {
			// 	path: 'counselors',
			// 	element: <CounselorListForStaff />,
			// },
			...studentRoutes,
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

		// ],
		// children: [{
		// 	path: 'student/:id',
		// 	element: <StudentDetailView  ><CreateDemandButton /> </StudentDetailView>,
		//   },
		//   {
		// 	path: 'student/:id/academic-transcript',
		// 	element: <AcademicTranscript />,
		//   },
		//   {
		// 	path: 'student/:id/attendance-report',
		// 	element: <AttendanceReport />,
		//   },
		//   {
		// 	path: 'student/:id/report/:appointmentId',
		// 	element: <StudentAppointmentReport />,
		//   },],
	},
];
