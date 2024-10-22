import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Counselor = lazy(() => import('./Counselor'))
const CounselorReport = lazy(() => import('./CounselorReport'))
export const counselorRoutes: RouteObject[] = [
  {
    path: 'counselor/:id',
    element: <Counselor />,
    children: [
      {
        path: 'report/:appointmentId',
        element: <CounselorReport />
      }
    ]
  }
];