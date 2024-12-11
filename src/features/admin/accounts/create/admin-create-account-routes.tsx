import { RouteObject } from 'react-router-dom';
import Accounts from '../Accounts';
import { lazy } from 'react';

const CreateAccount = lazy(()=> import('./CreateAccount'));

export const adminCreateAccountRoutes: RouteObject[] = [
  {
    path: 'create/:role?',
    element: <CreateAccount />      
     
  },

];