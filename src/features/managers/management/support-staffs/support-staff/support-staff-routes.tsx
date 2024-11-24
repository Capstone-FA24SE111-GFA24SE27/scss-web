import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import SupportStaff from './SupportStaff';

// const SupportStaff = lazy(() => import('./SupportStaff'))
// const SupportStaffReport = lazy(() => import('./SupportStaffReport'))
export const supportStaffRoutes: RouteObject[] = [
  {
    path: 'support-staff/:id',
    element: <SupportStaff />,
  }
];