import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { supportStaffsTableRoutes } from './table';
import { supportStaffsOverviewRoutes } from '../../dashboard/analytics/support-staff-overview';
import { supportStaffRoutes } from './support-staff';
const SupportStaffs = lazy(() => import('./table/SupportStaffs'))

export const supportStaffsRoutes: RouteObject[] = [
  {
    path: 'support-staffs',
    children: [
      {
        index: true,
        element: <SupportStaffs />,
      },
      ...supportStaffRoutes
      // ...supportStaffsTableRoutes,
      // ...supportStaffsOverviewRoutes,
    ]
  },
];