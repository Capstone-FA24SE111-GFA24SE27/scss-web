import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const AppointmentView = lazy(() => import('./AppointmentView'))
const CounselorView = lazy(() => import('@features/students/services/counseling/counselor/CounselorView'))

export const tabRoutes: RouteObject[] = [
  {
    path: 'counselor/:id',
    element: <CounselorView shouldShowBooking={false} />,
  },
];