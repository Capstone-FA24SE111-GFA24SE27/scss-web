import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import StudentView from './StudentView';
import AcademicTranscript from './AcademicTranscript';
export const studentsRoutes: RouteObject[] = [
  {
    path: 'student/:id',
    element: <StudentView />,
  },
  {
    path: 'student/:id/academic-transcript',
    element: <AcademicTranscript />,
  },
];