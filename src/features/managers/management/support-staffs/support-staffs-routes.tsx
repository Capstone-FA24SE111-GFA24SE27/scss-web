import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { supportStaffsTableRoutes } from './table';
import { supportStaffsOverviewRoutes } from './overview';
import { supportStaffRoutes } from './support-staff';

export const supportStaffsRoutes: RouteObject[] = [
  {
    path: 'support-staffs',
    children: [
      ...supportStaffsTableRoutes,
      ...supportStaffsOverviewRoutes,
      ...supportStaffRoutes
    ]
  },
];