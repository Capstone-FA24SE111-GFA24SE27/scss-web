import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
// const QuestionBoard = lazy(() => import('@shared/pages/question-board/QuestionBoard'))
const CounselorQuestionBoard = lazy(() => import('./CounselorQuestionBoard'))
const CounselorQnaForm = lazy(() => import('./CounselorQnaForm'))
export const counselorQuestionBoardRoutes: RouteObject[] = [
  {
    path: 'question-board',
    element: <CounselorQuestionBoard />,
    children: [
      {
        path: 'create',
        element: <CounselorQnaForm />,
      },
      {
        path: 'edit/:questionId',
        element: <CounselorQnaForm />,
      },
      {
        path: 'student-qna/edit/:questionId',
        element: <CounselorQnaForm />,
      },
    ]
  },
];