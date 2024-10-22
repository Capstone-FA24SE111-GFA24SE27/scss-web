import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import QnaDetails from './QnaDetails';
import { studentsRoutes } from '@/features/counselors';
import { reportRoutes } from '@/features/counselors/counseling/appointments/report';

const Qna = lazy(() => import('./Qna'))

export const qnaRoutes: RouteObject[] = [
    {
        path: 'qna',
        element: <Qna />,
        children: [
            {
                path: ':id/view',
                element: <QnaDetails />
            },
            ...studentsRoutes,
			...reportRoutes,
        ]
    }
];