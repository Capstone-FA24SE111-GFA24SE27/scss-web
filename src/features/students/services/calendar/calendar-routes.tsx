import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
import CounselorView from '../counseling/counselor/CounselorView';
import DateDetailScheduleView from './calendar-components/date/DateDetailScheduleView';
const Calendar = lazy(() => import("./calendar-layout"));
export const studentCalendarRoutes: RouteObject[] = [
  {
    path: 'calendar',
    element: <Calendar />,
    children: [
      {
        path: 'counselor/:id',
        element: <CounselorView shouldShowBooking={false} />,
      },
      {
        path: 'date/:date',
        element: <DateDetailScheduleView />
      }
    ]
  },
];
