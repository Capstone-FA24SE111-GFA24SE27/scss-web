import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { CounselorView } from '@/shared/pages';


export const tabRoutes: RouteObject[] = [
  {
    path: 'counselor/:id',
    element: <CounselorView shouldShowBooking={false} />,
  },  
];