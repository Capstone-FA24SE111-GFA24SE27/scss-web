import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { CounselorView } from '@/shared/pages';
import { appointmentRoutes } from '@/shared/pages/appointment';


export const tabRoutes: RouteObject[] = [
  ...appointmentRoutes,
  {
    path: 'counselor/:id',
    element: <CounselorView shouldShowBooking={false} />,
  },
];