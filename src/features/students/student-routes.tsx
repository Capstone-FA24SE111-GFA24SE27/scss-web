import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { demoFeatureRoutes } from './demo-feature/demo-feature-routes'

const StudentLayout = lazy(() => import('./student-layout'))

const studentRoutes: RouteObject[] = [
  {
    path: '/students',
    element: <StudentLayout />,
    children: [
      ...demoFeatureRoutes,
    ],
  },
];

export default studentRoutes;