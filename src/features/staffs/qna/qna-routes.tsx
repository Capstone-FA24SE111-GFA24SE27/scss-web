import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import QnaDetails from './QnaDetails';

const Qna = lazy(() => import('./Qna'))

export const qnaRoutes: RouteObject[] = [
    {
        path: 'qna',
        element: <Qna />,
        children: [
            {
                path: ':id/view',
                element: <QnaDetails />
            }
        ]
    }
];