import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const ReportCreate = lazy(() => import('./ReportCreate'))
const ReportView = lazy(() => import('./ReportView'))
export const reportRoutes: RouteObject[] = [
  {
    path: ':id/report/create',
    element:
      <Suspense fallback={<ContentLoading />}>
        <ReportCreate />
      </Suspense>
  },
  {
    path: ':id/report',
    element:
      <Suspense fallback={<ContentLoading />}>
        <ReportView />
      </Suspense>
  },
];