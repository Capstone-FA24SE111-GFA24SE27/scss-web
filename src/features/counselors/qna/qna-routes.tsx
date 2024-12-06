import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { converastionsRoutes } from './conversation';
import { myQnaRoutes } from './my-qna';
import { counselorQuestionBoardRoutes } from './question-board';
import { publicQnaRoutes } from '@/shared/pages';


export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    children: [
      ...converastionsRoutes,
      ...myQnaRoutes,
      ...publicQnaRoutes,
      ...counselorQuestionBoardRoutes
    ]
  },
];