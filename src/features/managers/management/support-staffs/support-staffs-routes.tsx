import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { supportStaffRoutes } from './support-staff';

const SupportStaffs = lazy(() => import('./SupportStaffs'))
// const SupportStaff = lazy(() => import('./supportStaff/SupportStaff'))
export const supportStaffsRoutes: RouteObject[] = [
  {
    path: 'support-staffs',
    element: <SupportStaffs />,
  },
  ...supportStaffRoutes
];