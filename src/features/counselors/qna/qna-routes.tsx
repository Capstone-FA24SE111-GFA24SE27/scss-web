import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { converastionsRoutes } from './conversation';
import { myQnaRoutes } from './my-qna';
import { counselorFaqRoutes } from './counselor-faq';
import { counselorPublicQnaRoutes } from './counselor-public-qna';


export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    children: [
      ...converastionsRoutes,
      ...myQnaRoutes,
      ...counselorPublicQnaRoutes,
      ...counselorFaqRoutes
    ]
  },
];