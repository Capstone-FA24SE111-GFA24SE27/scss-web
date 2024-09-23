import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const CounselorView = lazy(() => import('./CounselorView'))
const CounselorBooking = lazy(() => import('./CounselorBooking'))
export const counselorRoutes: RouteObject[] = [
  {
    path: ':id',
    element: <CounselorView />
  },
  {
    path: ':id/booking',
    element: <CounselorBooking />
  }
];