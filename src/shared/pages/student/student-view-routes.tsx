import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import StudentView from './StudentView';
import AcademicTranscript from './AttendanceReport';
import StudentAppointmentReport from './StudentAppointmentReport';
import StudentBooking from './StudentBooking';
export const studentViewRoutes: RouteObject[] = [
  {
    path: 'student/:id',
    element: <StudentView />,
  },
  {
    path: 'student/:id/academic-transcript',
    element: <AcademicTranscript />,
  },
  {
    path: 'student/:id/report/:appointmentId',
    element: <StudentAppointmentReport />,
  },
];