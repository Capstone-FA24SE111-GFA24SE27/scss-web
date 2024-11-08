import { ContentLoading } from '@/shared/components';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
const CounselorView = lazy(() => import('./CounselorView'))
// const CounselorBooking = lazy(() => import('./CounselorBooking'))
export const counselorRoutes: RouteObject[] = [
  {
    path: ':id',
    element: <Suspense fallback={<ContentLoading />}>
      <CounselorView />
    </Suspense>
  },
  // {
  //   path: ':id/booking',
  //   element: <Suspense fallback={<ContentLoading />}>
  //     <CounselorBooking />
  //   </Suspense>
  // }
];