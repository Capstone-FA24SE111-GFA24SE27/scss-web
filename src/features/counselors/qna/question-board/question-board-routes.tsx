import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const QuestionBoard = lazy(() => import('./QuestionBoard'))

export const questionBoardRoutes: RouteObject[] = [
  {
    path: 'question-board',
    element: <QuestionBoard />
  },
];