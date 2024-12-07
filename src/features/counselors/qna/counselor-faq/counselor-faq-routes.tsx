import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
// const Faq = lazy(() => import('@shared/pages/question-board/Faq'))
const CounselorFaq = lazy(() => import('./CounselorFaq'))
const CounselorQnaForm = lazy(() => import('./CounselorQnaForm'))
export const counselorFaqRoutes: RouteObject[] = [
  {
    path: 'faq',
    element: <CounselorFaq />,
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