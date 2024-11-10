import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
import { tabRoutes } from './tabs';
const Activity = lazy(() => import("./Activity"));

export const activityRoutes: RouteObject[] = [
  {
    path: 'activity',
    element: <Activity />,
    children: [
      ...tabRoutes
    ]
  },
];
