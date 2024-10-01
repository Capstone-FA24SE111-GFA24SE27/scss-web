import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const StudentView = lazy(() => import('@features/counselors/counselors-components/StudentView'))
const Appointments = lazy(() => import('./Appointments'))
const ReportView = lazy(() => import('./report'))
export const appointmentsRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />,
    children: [
      {
        path: 'student/:id',
        element:
          <Suspense fallback={<ContentLoading />}>
            <StudentView />
          </Suspense>
      },
      {
        path: ':id/report',
        element:
          <Suspense fallback={<ContentLoading />}>
            <ReportView />
          </Suspense>
      },
    ]
  },
];