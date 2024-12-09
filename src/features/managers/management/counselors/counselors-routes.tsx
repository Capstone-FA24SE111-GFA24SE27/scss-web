import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorsTableRoutes } from './table';
import {counselorOverviewRoutes} from './overview';
import { counselorRoutes } from './counselor';

export const counselorsRoutes: RouteObject[] = [
  {
    path: 'counselors',
    children: [
      ...counselorsTableRoutes,
      ...counselorOverviewRoutes,
      ...counselorRoutes,
    ]

  },
];