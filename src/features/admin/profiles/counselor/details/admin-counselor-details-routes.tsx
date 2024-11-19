import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Counselor = lazy(() => import('./Counselor'))
const CounselorReport = lazy(() => import('./CounselorReport'))
export const adminCounselorDetailsRoutes: RouteObject[] = [
  {
    path: 'counselors/:id',
    element: <Counselor />,
    children: [
      {
        path: 'report/:appointmentId',
        element: <CounselorReport />
      }
    ]
  }
];