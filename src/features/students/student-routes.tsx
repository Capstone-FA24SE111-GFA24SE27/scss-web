import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { demoFeatureRoutes } from './demo-feature/demo-feature-routes'

const StudentLayout = lazy(() => import('./student-layout'))

export const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...demoFeatureRoutes,
    ],
  },
];