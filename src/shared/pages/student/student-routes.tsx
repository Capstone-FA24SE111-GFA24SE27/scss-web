import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy-loaded components
const StudentView = lazy(() => import('./StudentView'));
const AcademicTranscript = lazy(() => import('./AcademicTranscript'));
const AttendanceReport = lazy(() => import('./AttendanceReport'));
const StudentAppointmentReport = lazy(() => import('./StudentAppointmentReport'));
const StudentBooking = lazy(() => import('./StudentBooking'));
// import StudentView from './StudentView';
// import AcademicTranscript from './AcademicTranscript';
// import AttendanceReport from './AttendanceReport';
// import StudentAppointmentReport from './StudentAppointmentReport';
// import StudentBooking from './StudentBooking';

// const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
//   <Suspense fallback={<ContentLoading />}>
//     <Component />
//   </Suspense>
// );

export const studentRoutes: RouteObject[] = [
  {
    path: 'student/:id',
    element: <StudentView/>,
  },
  {
    path: 'student/:id/booking',
    element: <StudentBooking/>,
  },
  {
    path: 'student/:id/academic-transcript',
    element: <AcademicTranscript/>,
  },
  {
    path: 'student/:id/attendance-report',
    element: <AttendanceReport/>,
  },
  {
    path: 'student/:id/report/:appointmentId',
    element: <StudentAppointmentReport/>,
  },
];
