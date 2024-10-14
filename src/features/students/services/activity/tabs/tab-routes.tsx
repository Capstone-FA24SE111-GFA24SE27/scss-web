import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const CounselorView = lazy(() => import('../../counseling/counselor/CounselorView'))

export const tabRoutes: RouteObject[] = [
  {
    path: 'counselor/:id',
    element: <CounselorView shouldShowBooking={false} />,
  },  
];