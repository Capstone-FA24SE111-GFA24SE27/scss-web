import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { qnaRoutes } from './qna/qna-routes';

const StaffLayout = lazy(() => import('./staff-layout'))

export const supportStaffRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StaffLayout />,
    children: [
        ...specialRoutes,
        ...qnaRoutes,
    ],
  },
];