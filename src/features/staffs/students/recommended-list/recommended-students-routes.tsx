import { CounselorView, studentRoutes, StudentView } from '@/shared/pages';
import StudentList from '@/shared/pages/student-list/StudentList';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ExcludeStudentButton from '../ExcludeStudentButton';
import CreateDemandButton from '../CreateDemandButton';
import CreateDemandForm from '../CreateDemandForm';
import FollowStudentButton from '../FollowStudentButton';

const StaffRecommendedStudentsLayout = lazy(()=>import('./StaffRecommendedStudentsLayout'))

export const staffRecommendedStudentsRoutes: RouteObject[] = [
	{

		path:'recommended',
        element: <StaffRecommendedStudentsLayout />,
		children: [
			
		
			{
				path: 'student/:id',
				element: <StudentView actionButton={<div className='flex items-center gap-16'> <ExcludeStudentButton /> <FollowStudentButton/>  </div>}  />,
			},
			{
				path: 'student/:id/create-demand',
				element: <CreateDemandForm  />,
			},
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
			...studentRoutes,
		]
		

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
