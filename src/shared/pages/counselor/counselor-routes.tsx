import { ContentLoading } from '@/shared/components';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const CounselorView = lazy(() => import('./CounselorView'))
const CounselorBooking = lazy(() => import('./CounselorBooking'))

// import CounselorView from './CounselorView';
// import CounselorBooking from './CounserlorBooking';

export const counselorRoutes: RouteObject[] = [
  {
    path: 'counselor/:id',
    element: <CounselorView />
  },
  {
    path: 'counselor/:id/booking',
    element: <CounselorBooking />
  }
];