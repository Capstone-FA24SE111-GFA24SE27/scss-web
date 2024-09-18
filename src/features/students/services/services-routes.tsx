import { RouteObject } from 'react-router-dom'
import CalendarLayout from './calendar/calendar-layout';
export const studentServicesRoutes: RouteObject[] = [
  {
    path: 'services/calendar',
    element: <CalendarLayout />,
  },
];
