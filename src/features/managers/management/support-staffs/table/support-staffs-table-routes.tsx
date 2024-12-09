import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const SupportStaffs = lazy(() => import('./SupportStaffs'))
// const SupportStaff = lazy(() => import('./supportStaff/SupportStaff'))
export const supportStaffsTableRoutes: RouteObject[] = [
  {
    path: 'table',
    element: <SupportStaffs />,
  },
];