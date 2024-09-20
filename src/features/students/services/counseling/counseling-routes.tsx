import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { CounselorView } from './counselor';
import { CounselingBooking } from './booking';
const Counseling = lazy(() => import('./Counseling'))
export const counselingRoutes: RouteObject[] = [
    {
        path: 'counseling',
        element: <Counseling />,
        children: [
            {
                path: ':id',
                element: <CounselorView />
            },
            {
                path: ':id/booking',
                element: <CounselingBooking />
            }
        ]
    },
];