import { RouteObject } from 'react-router-dom'
import CalendarLayout from './calendar-layout';
export const studentCalendarRoutes: RouteObject[] = [
  {
    path: 'calendar',
    element: <CalendarLayout />,
  },
];
