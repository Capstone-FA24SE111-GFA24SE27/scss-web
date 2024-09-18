import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { demoFeatureRoutes } from './demo-feature/demo-feature-routes'
import { DemoComponent } from './demo-feature/demo-feature-components';

const StudentLayout = lazy(() => import('./student-layout'))
// import StudentLayout from './student-layout';
export const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...demoFeatureRoutes,
      {
        path: 'services/home',
        element: <DemoComponent />
      }
    ],
  },
];