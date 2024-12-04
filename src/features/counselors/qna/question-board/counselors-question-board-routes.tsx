import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
// const QuestionBoard = lazy(() => import('@shared/pages/question-board/QuestionBoard'))
const CounselorQuestionBoard = lazy(() => import('./CounselorQuestionBoard'))
const PublicQnaForm = lazy(() => import('./PublicQnaForm'))
export const counselorQuestionBoardRoutes: RouteObject[] = [
  {
    path: 'question-board',
    element: <CounselorQuestionBoard />,
    children: [
      {
        path: 'create',
        element: <PublicQnaForm />,
      },
      {
        path: 'edit/:questionId',
        element: <PublicQnaForm />,
      },
      {
        path: 'student-qna/edit/:questionId',
        element: <PublicQnaForm />,
      },
    ]
  },
];