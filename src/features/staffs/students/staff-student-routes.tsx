import { StudentView, studentRoutes } from '@/shared/pages';
import StudentList from '@/shared/pages/student-list/StudentList';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import CreateDemandButton from '../CreateDemandButton';


export const staffStudentRoutes: RouteObject[] = [
	{
		path: 'student-list',
		element: <StudentList isShowingTab={true} />,
		children: [
			{
				path: 'student/:id',
				element: <StudentView actionButton={<CreateDemandButton />} />,
			},
			...studentRoutes,

		],
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
