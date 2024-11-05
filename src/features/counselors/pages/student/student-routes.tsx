import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import StudentView from './StudentView';
import AcademicTranscript from './AcademicTranscript';
import AttendanceReport from './AttendanceReport';
import StudentAppointmentReport from './StudentAppointmentReport';
import StudentBooking from './StudentBooking';
export const studentRoutes: RouteObject[] = [
  {
    path: 'student/:id',
    element: <StudentView />,
  },
  {
    path: 'student/:id/booking',
    element: <StudentBooking />,
  },
  {
    path: 'student/:id/academic-transcript',
    element: <AcademicTranscript />,
  },
  {
    path: 'student/:id/attendance-report',
    element: <AttendanceReport />,
  },
  {
    path: 'student/:id/report/:appointmentId',
    element: <StudentAppointmentReport />,
  },
];