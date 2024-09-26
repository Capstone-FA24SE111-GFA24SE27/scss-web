import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
import { tabRoutes } from './tabs';
const DemoFeature = lazy(() => import("./Activity"));

export const activityRoutes: RouteObject[] = [
  {
    path: 'activity',
    element: <DemoFeature />,
    children: [
      ...tabRoutes
    ]
  },
];
