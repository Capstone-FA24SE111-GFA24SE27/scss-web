import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ContentLoading } from '@/shared/components';
import { studentsRoutes } from '../student';

const Requests = lazy(() => import('./Requests'))
const StudentView = lazy(() => import('@/features/counselors/counseling/student/StudentView'))

export const requestsRoutes: RouteObject[] = [
  {
    path: 'requests',
    element: <Requests />,
    children: [
      ...studentsRoutes
    ]
  },
];