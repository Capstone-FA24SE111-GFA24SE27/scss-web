import { RouteObject } from 'react-router-dom';
import { SignIn } from './auth-pages';

export const authRoutes: RouteObject[] = [
  {
    path: '/',
    element: <SignIn />,
  },
];